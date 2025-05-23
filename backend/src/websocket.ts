import { FastifyRequest } from "fastify";
import User from "./User";
import { Game, games, GameState } from "./Game";
import { sqlite } from ".";
import { generateRandomSecret, getTotpCode } from "./2fa";


export let onlineUsers: User[] = [];

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  const row: any = sqlite.prepare("SELECT username, displayName, secret2fa FROM users WHERE id = ?")
    .get(req.jwtUserId);

  if (row == undefined) {
    socket.close();
    return;
  }

  const user = new User(req.jwtUserId, row.username, row.displayName, socket);
  let secret2fa: string | undefined = row.secret2fa ?? undefined;

  socket.addEventListener("close", () => {
    onlineUsers.splice(onlineUsers.indexOf(user), 1);
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
        joinGame(user, message);
        break;
      case "set_friend":
        setFriend(socket, user.id, message);
        break;
      case "remove_friend":
        removeFriend(socket, user.id, message.name);
        break;
      case "get_info_profile" :
        getInfoProfile(user);
        break;
      case "get_games_history":
        getGamesHistory(socket, user.id);
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
      case "del_account":
        const success = deleteAccount(user.id);
        socket.send(JSON.stringify({ event: "del_account", success }));
        if (success)
          socket.close();
        break;
      case "2fa":
        const secret = setup2fa(socket, user, secret2fa, message);
        if (secret != undefined)
          secret2fa = secret;
        break;
      case "2fa_check":
        await check2fa(user, secret2fa, message);
        break;
    }
  });
}

function getStatus(socket: WebSocket, message: any) {
  const allStatus: boolean[] = message.friends.map((friend: string) => {
    return !!onlineUsers.find(u => u.displayName === friend);
  });

  socket.send(JSON.stringify({
    event: "get_status",
    status: allStatus
  }));
}

function deleteAccount(id_user: number): boolean {
  const result = sqlite.prepare("DELETE FROM users WHERE id = ?").run(id_user);
  return result.changes > 0;
}

function getUserID(name: string) {
  const result: any = sqlite.prepare("SELECT id FROM users WHERE displayName = ?")
    .get(name);
  return result && result.id;
}


function removeFriend(socket: WebSocket, id_user: number, friend: string) {
  const friendid = getUserID(friend);

  const result = sqlite.prepare("DELETE FROM friends WHERE userid = ? AND friendid = ?")
    .run(id_user, friendid);

  socket.send(JSON.stringify({
    event: "remove_friend",
    success: result.changes != 0
  }));
}

function setFriend(socket: WebSocket, id_user: any, message: any) {
  const friendid = getUserID(message.name);

  if (!friendid || id_user == friendid) {
    socket.send(JSON.stringify({
      event: "set_friend",
      success: false
    }));
    return;
  }

  const result = sqlite.prepare(`
      INSERT INTO friends (userid, friendid)
      SELECT ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM friends WHERE userid = ? AND friendid = ?)
  `).run(id_user, friendid, id_user, friendid);

  socket.send(JSON.stringify({
    event: "set_friend",
    success: result.changes != 0
  }));
}

function getFriends(user: User) {
  const rows: any[] = sqlite.prepare(`SELECT u.displayName FROM friends f
      JOIN users u ON f.friendid = u.id WHERE f.userid = ?`).all(user.id);
  return rows.map(row => row.displayName);
}

function getInfoProfile(user: User) {
  const row: any = sqlite.prepare("SELECT displayName, avatar FROM users WHERE id = ?")
    .get(user.id);

  const friends = getFriends(user);

  user.socket.send(JSON.stringify({
    event: "get_info_profile",
    name: row.displayName,
    avatar: row.avatar,
    friends: friends
  }));
}

function getGames(socket: WebSocket) {
  socket.send(JSON.stringify({ event: "get_games", games }));
}

function joinGame(user: User, message: any) {
  let game = games.find((g) => g.uid == message.uid);
  if (game == undefined) {
    games.push(game = new Game(message.name, message.uid));
    for (let user of onlineUsers)
      user.socket.send(JSON.stringify({ event: "get_games", games }));
  }
  game.addUser(user);
}

export function insertGameHistory(data: {
  name1: string,
  name2: string,
  score1: number,
  score2: number,
  date: string
}) {
  sqlite.prepare(`INSERT INTO games (name1, name2, score1, score2, date)
                  VALUES (?, ?, ?, ?, ?)`)
    .run(data.name1, data.name2, data.score1, data.score2, data.date);
}

function getDisplayName(userId: number): string[] {
  const row: any = sqlite.prepare(`SELECT displayName FROM users WHERE id = ?`)
    .get(userId);

  return row.displayName;
}

function getGamesHistory(socket: WebSocket, userId: number) {
  const rows = sqlite.prepare("SELECT name2, score1, score2, date FROM games WHERE name1 = ?")
    .all(getDisplayName(userId));

  socket.send(JSON.stringify({
    event: "get_games_history",
    games: rows
  }));
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

function setup2fa(socket: WebSocket, user: User, secret: string | undefined, message: any) {
  if (message.enable == undefined) {
    const row: any = sqlite.prepare("SELECT secret2fa FROM users WHERE id = ?")
      .get(user.id);
    socket.send(JSON.stringify({ event: "2fa", enable: row && row.secret2fa }));
  } else if (message.enable) {
    secret = generateRandomSecret();
    socket.send(JSON.stringify({ event: "2fa", secret: secret, username: user.username }));
    return secret;
  } else {
    sqlite.prepare("UPDATE users SET secret2fa = NULL WHERE id = ?")
      .run(user.id);
  }
}

async function check2fa(user: User, secret: string | undefined, message: any) {
  if (secret == undefined)
    return;

  const success = await getTotpCode(secret) == message.code;
  if (success) {
    sqlite.prepare("UPDATE users SET secret2fa = ? WHERE id = ?")
      .run(secret, user.id);
  }
  user.socket.send(JSON.stringify({ event: "2fa_check", success }));
}
