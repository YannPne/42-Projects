import { FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import User from "./User";
import { Game, games, GameState } from "./Game";
import { sqlite } from ".";


export let onlineUsers: User[] = [];

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  let user: User | undefined;

  socket.addEventListener("close", () => {
      onlineUsers.splice(onlineUsers.indexOf(user!), 1);
  });  

  socket.addEventListener("message", async (event) => {
    const message = JSON.parse(event.data);
    switch (message.event) {
      case "get_games":
        getGames(socket);
        break;
      case "get_status":
        getStatus(socket, message);
        break;
      case "join_game":
        joinGame(user!, message);
        break;
      case "set_friend":
        setFriend(socket, user?.id, message);
        break;
      case "remove_friend":
        removeFriend(socket, user!.id, message.name);
        break;
      case "get_info_profile" :
        getInfoProfile(socket, user!.id);
        break;
      case "get_games_history":
        getGamesHistory(socket, user!.id);
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
        const success = delAccount(socket, user!.id);
        socket.send(JSON.stringify({ event: "del_account", success: success }));
        success && (user = undefined, socket.close());
        break;
      case "login":
        user = login(message);
        socket.send(JSON.stringify({ event: "login", success: user != undefined }));
        user != undefined ? (user!.socket = socket, onlineUsers.push(user!)): socket.close();
        break;
      case "register":
        user = register(message);
        socket.send(JSON.stringify({ event: "register", success: user != undefined }));
        user != undefined ? (user!.socket = socket, onlineUsers.push(user!)) : socket.close();  
        break;
    }
  });
}

function getStatus(socket: WebSocket, message: any)
{
  const all_status: boolean[] = message.friends.map((friend: string) => {return !!onlineUsers.find(u => u.name === friend)})

  socket.send(JSON.stringify({
    event: "get_status",
    status: all_status,
  }));
}

function delAccount(socket: WebSocket, id_user: number) 
{
  try 
  {
    const deleteUserTransaction = sqlite.transaction(() => 
    {
      sqlite.prepare("DELETE FROM friends WHERE userid = ? OR friendid = ?").run(id_user, id_user);
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

function getUserID(name: string)
{
  const result: any = sqlite.prepare("SELECT id FROM users WHERE displayName = ?")
    .get(name);

    return result && result.id;
}


function removeFriend(socket: WebSocket, id_user: number, friend: string)
{
  const friendid = getUserID(friend);

  const result = sqlite.prepare("DELETE FROM friends WHERE userid = ? AND friendid = ?")
    .run(id_user, friendid);

    socket.send(JSON.stringify({
      event: "remove_friend",
      success: result.changes != 0,
    }));
}

function setFriend(socket: WebSocket, id_user: any, friend: any) 
{
  const friendid = getUserID(friend.name);

  if (!friendid || id_user == friendid)
  {
    socket.send(JSON.stringify({
      event: "set_friend",
      success: false
    }));
    return ;
  }

  const result = sqlite.prepare(`
    INSERT INTO friends (userid, friendid)
    SELECT ?, ?
    WHERE NOT EXISTS ( SELECT 1 FROM friends WHERE (userid = ? AND friendid = ?) OR (userid = ? AND friendid = ?)
  )
  `).run(id_user, friendid, id_user, friendid, id_user, friendid);  
    
  socket.send(JSON.stringify({
    event: "set_friend",
    success: result.changes != 0
  }));
}

function getFriends(socket: WebSocket, id_user: Number) 
{
  const rows: any[] = sqlite.prepare(`SELECT u.displayName
                                      FROM friends f
                                      JOIN users u ON f.friendid = u.id
                                      WHERE f.userid = ?;
                                      `).all(id_user);
  return rows.map(row => row.displayName);
}

function getInfoProfile(socket: WebSocket, id_user: number) 
{
  const row: any = sqlite.prepare("SELECT displayName, avatar FROM users WHERE id = ?")
    .get(id_user);

  const friends = getFriends(socket, id_user);  

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
  const result = sqlite.prepare(`INSERT INTO users (username, displayName, email, password)
                                 SELECT ?, ?, ?, ?
                                 WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = ? AND displayName = ?)`)
    .run(message.username, message.displayName, message.email, bcrypt.hashSync(message.password, 10), message.username, message.displayName);

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
    for (let user of onlineUsers) {
      user.socket!.send(JSON.stringify({ event: "get_games", games }));
    }
  }
  game.addUser(user);
}

export function insertGameHistory(data: {name1: string, name2: string, score1: number, score2: number, date: string})
{
  const result = sqlite.prepare(`INSERT INTO games (name1, name2, score1, score2, date) VALUES (?, ?, ?, ?, ?)`)
    .run(data.name1, data.name2, data.score1, data.score2, data.date);
}

function getDisplayName(userId: number): string[] {
  const row: any = sqlite.prepare(`SELECT displayName 
                              FROM users
                              WHERE id = ?`).get(userId);

  return row.displayName;
}

function getDisplayNameOpponent(userId: number): string[] {
  const rows: any[] = sqlite.prepare(`SELECT name2 frome games WHERE name1 = ?`).all(getDisplayName(userId)); // JOIN users ON games.user2 = users.id 
  return rows.map(row => row.displayName);
}


function getGamesHistory(socket: WebSocket, id_user: number) {

  const rows: any[] = sqlite.prepare("SELECT * FROM games WHERE name1 = ?")
    .all(getDisplayName(id_user));

    const name1 = rows.map(row => row.name1);
    const name2 = rows.map(row => row.name2);
    const gameScore1 = rows.map(row => row.score1);
    const gameScore2 = rows.map(row => row.score2);
    const date = rows.map(row => row.date);

    socket.send(JSON.stringify({
      event: "get_games_history",
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