import { FastifyRequest } from "fastify";
import User from "./User";
import { Game, games, GameState } from "./Game";
import { sqlite } from ".";

export let webSocketInstances: WebSocket[] = [];

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  const row: any = sqlite.prepare("SELECT displayName FROM users WHERE id = ?")
    .get(req.jwtUserId);

  const user = new User(req.jwtUserId, row.displayName, socket);

  webSocketInstances.push(socket);
  socket.addEventListener("close", () =>
    webSocketInstances.splice(webSocketInstances.indexOf(socket), 1));

  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    switch (message.event) {
      case "get_games":
        getGames(socket);
        break;
      case "join_game":
        joinGame(user, message);
        break;
      case "add_local_player":
        addLocalPlayer(user, message);
        break;
      case "play":
        play(user);
        break;
      case "move":
        move(user, message);
        break;
    }
  });
}

function getGames(socket: WebSocket) {
  socket.send(JSON.stringify({ event: "get_games", games }));
}

function joinGame(user: User, message: any) {
  let game = games.find((g) => g.uid == message.uid);
  if (game == undefined) {
    games.push(game = new Game(message.name, message.uid));
    for (let webSocket of webSocketInstances)
      webSocket.send(JSON.stringify({ event: "get_games", games }));
  }
  game.addUser(user);
}

function addLocalPlayer(user: User, message: any) {
    user.game?.addLocalPlayer(message.name, message.isAi ? undefined : user);
}

function play(user: User) {
  if (user.game != undefined) {
    if (user.game.players.length % 2 != 0)
      user.game.addLocalPlayer("AI");
    user.game.state = GameState.IN_GAME;
  }
}

function move(user: User, message: any) {
  if (user.game == undefined)
    return;

  const player = user.players.find((p) => p == user.game?.players[message.id]);
  if (player == undefined)
    return;

  if (message.goUp != undefined)
    player.goUp = message.goUp;
  if (message.goDown != undefined)
    player.goDown = message.goDown;
}
