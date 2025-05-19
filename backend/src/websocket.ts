import { FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import User from "./User";
import { Game, games, GameState } from "./Game";
import { sqlite } from ".";

export let webSocketInstances: WebSocket[] = [];

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  let user: User | undefined;

  webSocketInstances.push(socket);
  socket.addEventListener("close", () =>
    webSocketInstances.splice(webSocketInstances.indexOf(socket), 1));

  socket.addEventListener("message", async (event) => {
    const message = JSON.parse(event.data);
    switch (message.event) {
      case "get_games":
        getGames(socket);
        break;
      case "join_game":
        joinGame(user!, message);
        break;
      case "add_local_player":
        addLocalPlayer(user!, message);
        break;
      case "play":
        play(user!);
        break;
      case "move":
        move(user!, message);
        break;
      case "login":
        user = login(message);

        socket.send(JSON.stringify({
          event: "login",
          success: user != undefined
        }));

        if (user != undefined)
          user!.socket = socket;
        else
          socket.close();
        break;
      case "register":
        user = register(message);
        socket.send(JSON.stringify({
          event: "register",
          success: user != undefined
        }));

        if (user != undefined)
          user!.socket = socket;
        socket.close();
        break;
    }
  });
}

function login(message: any) {
  const row: any = sqlite.prepare("SELECT id, displayName, password FROM users WHERE username = ?")
    .get(message.username);

  if (row == undefined || !bcrypt.compareSync(message.password, row.password))
    return;

  return new User(row.id, row.displayName);
}

function register(message: any) {
  const result = sqlite.prepare(`INSERT INTO users (username, displayName, password)
                                 SELECT ?, ?, ?
                                 WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = ?)`)
    .run(message.username, message.displayName, bcrypt.hashSync(message.password, 10), message.username);

  if (result.changes == 0)
    return;
  return new User(result.lastInsertRowid as number, message.displayName);
}

function getGames(socket: WebSocket) {
  socket.send(JSON.stringify({ event: "get_games", games }));
}

function joinGame(user: User, message: any) {
  let game = games.find((g) => g.uid == message.uid);
  if (game == undefined) {
    games.push((game = new Game(message.name, message.uid)));
    for (let webSocket of webSocketInstances) {
      webSocket.send(JSON.stringify({ event: "get_games", games }));
    }
  }
  game.addUser(user);
}

function addLocalPlayer(user: User, message: any) {
  if (message.isAi) user.game?.addLocalPlayer(message.name);
  else user.game?.addLocalPlayer(message.name, user);
}

function play(user: User) {
  if (user.game != undefined) {
    if (user.game.players.length % 2 != 0) user.game.addLocalPlayer("AI");
    user.game.state = GameState.IN_GAME;
  }
}

function move(user: User, message: any) {
  if (user.game == undefined) return;

  const player = user.players.find((p) => p == user.game?.players[message.id]);
  if (player == undefined) return;

  if (message.goUp != undefined) player.goUp = message.goUp;
  if (message.goDown != undefined) player.goDown = message.goDown;
}
