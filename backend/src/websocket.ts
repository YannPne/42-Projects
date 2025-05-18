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
      case "set_friend":
        set_friend(socket, user?.id, message);
        break;
      case "remove_friend":
        remove_friend(socket, user?.id, message);
        break;
      case "get_info_profile" :
        get_info_profile(socket, user?.id);
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
      case "del_account":
        const success = del_account(socket, user?.id);
        socket.send(JSON.stringify({ event: "del_account", success: success }));
        success && (user = undefined);
        break;
      case "login":
        user = login(message);
        socket.send(JSON.stringify({ event: "login", success: user != undefined }));
        user != undefined ? user!.socket = socket : socket.close();
        break;
      case "register":
        user = register(message);
        socket.send(JSON.stringify({ event: "register", success: user != undefined }));
        user != undefined ? user!.socket = socket : socket.close();
        break;
    }
  });
}

function del_account(socket: WebSocket, id_user: number) 
{
  try 
  {
    const myName = get_displayName(id_user);

    const deleteUserTransaction = sqlite.transaction(() => 
    {
      sqlite.prepare("DELETE FROM friends WHERE name1 = ? OR name2 = ?").run(myName, myName);
      sqlite.prepare("DELETE FROM games WHERE user1 = ? OR user2 = ?").run(myName, myName);
      sqlite.prepare("DELETE FROM users WHERE id = ?").run(id_user);
    });

    deleteUserTransaction();
    return true;
  } 
  catch (error) 
  {
    console.error("Error deleting account:", error);
    return false;
  }
}


function remove_friend(socket, id_user, friend)
{
  const id = parseInt(id_user, 10);

  const myName = get_displayName(id_user);

  const result = sqlite.prepare("DELETE FROM friends WHERE name1 = ? AND name2 = ?")
    .run(myName, friend.name);

    socket.send(JSON.stringify({
      event: "remove_friend",
      success: result.changes != 0,
    }));
}

function set_friend(socket: WebSocket, id_user: any, friend: any) 
{
  const myName = get_displayName(id_user);

  if (myName == friend.name)
  {
    socket.send(JSON.stringify({
      event: "set_friend",
      success: false
    }));
    return ;
  }

  const result = sqlite.prepare(`
    INSERT INTO friends (name1, name2)
    SELECT ?, ?
    WHERE EXISTS (SELECT 1 FROM users WHERE displayName = ?)
    AND NOT EXISTS (SELECT 1 FROM friends WHERE name1 = ? AND name2 = ?)
  `).run(myName, friend.name, friend.name, myName, friend.name);
  
    
  socket.send(JSON.stringify({
    event: "set_friend",
    success: result.changes != 0
  }));
}

function get_friend(socket: WebSocket, myName: any) 
{
  const rows: any[] = sqlite.prepare("SELECT name2 FROM friends WHERE name1 = ?")
    .all(myName);

  return rows.map(row => row.name2);
}

function get_info_profile(socket: WebSocket, id_user: any) 
{
  const id = parseInt(id_user, 10);
  const row = sqlite.prepare("SELECT displayName, avatar FROM users WHERE id = ?")
    .get(id);

  const friends = get_friend(socket, row.displayName);  

    socket.send(JSON.stringify({
      event: "get_info_profile",
      name: row.displayName,
      avatar: row.avatar,
      friends: friends,
    }));
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
  const date = data.date.toString();

  const result = sqlite.prepare(`INSERT INTO games (user1, user2, score1, score2, date) VALUES (?, ?, ?, ?, ?)`)
    .run(id1, id2, score1, score2, date);
}

function get_displayName(userId: number): string[] {
  const row: any = sqlite.prepare(`SELECT displayName 
                              FROM users
                              WHERE id = ?`).get(userId);

  return row.displayName;
}

function get_displayName_opponent(userId: number): string[] {
  const rows: any[] = sqlite.prepare(`SELECT users.displayName 
                              FROM games 
                              JOIN users ON 1 = users.id 
                              WHERE games.user1 = ?`).all(userId); // JOIN users ON games.user2 = users.id 
  return rows.map(row => row.displayName);
}


function get_games_history(socket: WebSocket, id_user) {
  const id = parseInt(id_user, 10);

  const rows: any[] = sqlite.prepare("SELECT * FROM games WHERE user1 = ?")
    .all(id);

    const gameId1 = rows.map(row => row.user1);
    const gameId2 = rows.map(row => row.user2);
    const gameScore1 = rows.map(row => row.score1);
    const gameScore2 = rows.map(row => row.score2);
    const date = rows.map(row => row.date);

    const name1 = get_displayName(id_user);
    const name2 = get_displayName_opponent(id_user);

    socket.send(JSON.stringify({
      event: "get_games_history",
      id1: gameId1,
      id2: gameId2,
      score1: gameScore1,
      score2: gameScore2,
      name1: name1,
      name2: name2,
      date: date,
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