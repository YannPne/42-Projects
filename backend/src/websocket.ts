import { FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import User from "./User";
import { Game, games, GameState } from "./Game";
import { sqlite } from ".";


export let onlineUsers: User[] = [];

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  let user: User | undefined;
  let userProfileId: number;

  socket.addEventListener("close", () => {
      onlineUsers.splice(onlineUsers.indexOf(user!), 1);
  });  

  socket.addEventListener("message", async (event) => {
    const message = JSON.parse(event.data);
    switch (message.event) {
      case "set_profile":
        userProfileId = message.name ? getUserID(message.name) : user!.id;
        break;
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
      case "set_hide_profile":
        set_hide_profile(user!.id, message.hide);
        break;
      case "remove_friend":
        removeFriend(socket, user!.id, message.name);
        break;
      case "get_info_profile" :
        getInfoProfile(socket, userProfileId || user?.id);
        break;
      case "get_games_history":
        getGamesHistory(socket, userProfileId || user?.id);
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
      case "update_info":
        updateInfo(socket, user!, message);
        break;
      case "del_account":
        const success = deleteAccount(user!.id);
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

function set_hide_profile(id_user: number, hide: boolean)
{
  sqlite.prepare(`UPDATE users SET hideProfile = ? WHERE id = ?`).run(hide ? 1 : 0, id_user);
}

function updateInfo(socket: WebSocket, user: User, msg: any)
{
  let result;
  if (!msg.password)
  {
    result = sqlite.prepare(`UPDATE users
      SET username = ?, displayName = ?, email = ?
      WHERE id = ?
      AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE (username = ? OR displayName = ?) AND id != ?
    )`).run(msg.username, msg.displayName, msg.email, user.id, msg.username, msg.displayName, user.id);
  }
  else
  {
    result = sqlite.prepare(`UPDATE users
      SET username = ?, displayName = ?, email = ?, password = ?
      WHERE id = ?
      AND NOT EXISTS (
      SELECT 1 FROM users
      WHERE (username = ? OR displayName = ?) AND id != ?
      )`).run(msg.username, msg.displayName, msg.email, bcrypt.hashSync(msg.password, 10), user.id, msg.username, msg.displayName, user.id);
  }
  
    

  socket.send(JSON.stringify({ 
    event: "update_info", 
    success: result.changes > 0,
  }));

  if (result.changes > 0)
    user.name = msg.displayName;
}

function getStatus(socket: WebSocket, message: any)
{
  const all_status: boolean[] = message.friends.map((friend: string) => {return !!onlineUsers.find(u => u.name === friend)})

  socket.send(JSON.stringify({
    event: "get_status",
    status: all_status,
  }));
}

function deleteAccount(id_user: number): boolean {
  const result = sqlite.prepare("DELETE FROM users WHERE id = ?").run(id_user);

  return result.changes > 0 ? true : false;
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
  const row: any = sqlite.prepare("SELECT * FROM users WHERE id = ?")
    .get(id_user);

  const friends = getFriends(socket, id_user); 

    socket.send(JSON.stringify({
      event: "get_info_profile",
      name: row.username,
      displayName: row.displayName,
      avatar: row.avatar,
      email: row.email,
      friends: friends,
      status: !!onlineUsers.find(u => u.id == id_user),
      hideProfile: row.hideProfile,
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
  sqlite.prepare(`INSERT INTO games (name1, name2, score1, score2, date) VALUES (?, ?, ?, ?, ?)`)
    .run(data.name1, data.name2, data.score1, data.score2, data.date);
}

function getDisplayName(userId: number): string[] {
  const row: any = sqlite.prepare(`SELECT displayName 
                              FROM users
                              WHERE id = ?`).get(userId);

  return row.displayName;
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