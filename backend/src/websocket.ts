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
      // case "get_avatar" :
      //   get_avatar(socket, user?.id);
        break;
      case "get_games_history":
        get_games_history(socket, user?.id);
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

// function get_avatar(socket: WebSocket, id_user) {
//   const id = parseInt(id_user, 10);

//   const row = sqlite.prepare("SELECT avatar FROM users WHERE id = 1")
//     .get();

//     if (row?.avatar) {
//       const avatarBase64: string = row.avatar.toString('base64');

//     socket.send(JSON.stringify({
//       event: "get_avatar",
//       avatar: avatarBase64,
//     }));
// }

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
  let game = games.find(g => g.uid == message.uid);
  if (game == undefined) {
    games.push(game = new Game(message.name, message.uid));
    for (let webSocket of webSocketInstances) {
      webSocket.send(JSON.stringify({ event: "get_games", games }));
    }
  }
  game.addUser(user);
}

export function insert_game_history(data)
{
  const id1 = parseInt(data.Id1, 10);
  const id2 = data.Id2 === true ? 0 : parseInt(data.Id2, 10);
  const score1 = parseInt(data.score1, 10);
  const score2 = parseInt(data.score2, 10);

  const result = sqlite.prepare(`INSERT INTO games (user1, user2, score1, score2) VALUES (?, ?, ?, ?)`)
    .run(id1, id2, score1, score2);
}

function get_displayName_opponent(userId: number): string[] {
  const rows: any[] = sqlite.prepare(`SELECT users.displayName 
                              FROM games 
                              JOIN users ON games.user2 = users.id 
                              WHERE games.user1 = ?`).all(userId);
  return rows;
}


function get_games_history(socket: WebSocket, id_user) {
  const id = parseInt(id_user, 10);

  const rows: any[] = sqlite.prepare("SELECT * FROM games WHERE user1 = ?")
    .all(id);

    const gameId1 = rows.map(row => row.user1);
    const gameId2 = rows.map(row => row.user2);
    const gameScore1 = rows.map(row => row.score1);
    const gameScore2 = rows.map(row => row.score2);
    
    console.log(gameId1);
    
    const name2 = get_displayName_opponent(id_user);
    console.log("--------------");
    console.log(name2);
    console.log("--------------");


    socket.send(JSON.stringify({
      event: "get_games_history",
      id1: gameId1,
      id2: gameId2,
      score1: gameScore1,
      score2: gameScore2,
      name1: gameScore2,
      name2: gameScore2,
    }));
}

function addLocalPlayer(user: User, message: any) {
  if (message.isAi)
    user.game?.addLocalPlayer(message.name);
  else
    user.game?.addLocalPlayer(message.name, user);
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

  const player = user.players.find(p => p == user.game?.players[message.id]);
  if (player == undefined)
    return;

  if (message.goUp != undefined)
    player.goUp = message.goUp;
  if (message.goDown != undefined)
    player.goDown = message.goDown;
}