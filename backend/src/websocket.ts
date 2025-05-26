import { FastifyRequest } from "fastify";
import User from "./User";
import { Game, games, GameState } from "./Game";
import { sqlite } from ".";
import { generateRandomSecret, getTotpCode } from "./2fa";
import bcrypt from "bcrypt";

export let onlineUsers: User[] = [];

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  const row: any = sqlite.prepare("SELECT username, displayName, secret2fa FROM users WHERE id = ?")
      .get(req.jwtUserId);

  if (row == undefined) {
    socket.close();
    return;
  }

  const user = new User(req.jwtUserId, row.username, row.displayName, socket);
  onlineUsers.push(user);
  let secret2fa: string | undefined = row.secret2fa ?? undefined;

  socket.addEventListener("close", () => {
    onlineUsers.splice(onlineUsers.indexOf(user), 1);
    user.game?.removeUser(user);
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
      case "leave_game":
        leaveGame(user);
        break;
      case "set_friend":
        setFriend(socket, user.id, message);
        break;
      case "set_hide_profile":
        setHideProfile(user.id, message.hide);
        break;
      case "remove_friend":
        removeFriend(socket, user.id, message.name);
        break;
      case "broadcast_message":
        broadcastMessage(message, user.id);
        break;
      case "swap_blocked":
        swapBlocked(socket, user.id, message.id);
        break;
      case "get_dm_info":
        getInfoDm(socket, user.id, message.otherUser);
        break;
      case "get_info_profile":
        getInfoProfile(user, getUserID(message.profileUsername) ?? user.id);
        break;
      case "get_games_history":
        getGamesHistory(socket, getUserID(message.name) || user.id);
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
      case "invite_player":
        invitePlayer(user, message);
        break;
      case "update_info":
        updateInfo(socket, user!, message);
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

function setHideProfile(userId: number, hide: boolean) {
  sqlite.prepare("UPDATE users SET hideProfile = ? WHERE id = ?")
      .run(hide ? 1 : 0, userId);
}

function updateInfo(socket: WebSocket, user: User, msg: any) {
  let result;
  if (msg.avatar)
    msg.avatar = Buffer.from(msg.avatar);

  if (!msg.password) {
    result = sqlite.prepare(`UPDATE users
        SET username = ?, displayName = ?, email = ?, avatar = ?
        WHERE id = ? AND NOT EXISTS (
            SELECT 1 FROM users WHERE (username = ? OR displayName = ?) AND id != ?)`)
        .run(msg.username, msg.displayName, msg.email, msg.avatar, user.id, msg.username, msg.displayName, user.id);
  } else {
    result = sqlite.prepare(`UPDATE users
        SET username = ?, displayName = ?, email = ?, avatar = ?, password = ?
        WHERE id = ? AND NOT EXISTS (
            SELECT 1 FROM users WHERE (username = ? OR displayName = ?) AND id != ?)`)
        .run(msg.username, msg.displayName, msg.email, msg.avatar, bcrypt.hashSync(msg.password, 10), user.id, msg.username, msg.displayName, user.id);
  }


  socket.send(JSON.stringify({
    event: "update_info",
    success: result.changes > 0,
  }));

  if (result.changes > 0)
    user.displayName = msg.displayName;
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

function deleteAccount(userId: number): boolean {
  const name: string = getDisplayName(userId);

  const result = sqlite.prepare("DELETE FROM users WHERE id = ?").run(userId);
  sqlite.prepare(`UPDATE games
    SET name1 = CASE WHEN name1 = ? THEN ? ELSE name1 END,
        name2 = CASE WHEN name2 = ? THEN ? ELSE name2 END
    WHERE name1 = ? OR name2 = ?;
  `).run(name, "{Deleted User}", name, "{Deleted User}", name, name);

  return result.changes > 0;
}

function getUserID(name: string): number | undefined {
  const result: any = sqlite.prepare("SELECT id FROM users WHERE displayName = ?")
      .get(name);
  return result?.id;
}

function removeFriend(socket: WebSocket, userId: number, friend: string) {
  const friendId = getUserID(friend);

  const result = sqlite.prepare("DELETE FROM friends WHERE userid = ? AND friendid = ?")
      .run(userId, friendId);

  socket.send(JSON.stringify({
    event: "remove_friend",
    success: result.changes != 0
  }));
}

function setFriend(socket: WebSocket, userId: any, message: any) {
  const friendId = getUserID(message.name);

  if (!friendId || userId == friendId) {
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
  `).run(userId, friendId, userId, friendId);

  socket.send(JSON.stringify({
    event: "set_friend",
    success: result.changes != 0
  }));
}

function getFriends(userToGet: number) {
  const rows: any[] = sqlite.prepare(`SELECT u.displayName
      FROM friends f
      JOIN users u ON f.friendid = u.id
      WHERE f.userid = ?`).all(userToGet);
  return rows.map(row => row.displayName);
}

function invitePlayer(user: User, message: any) {
  const invite = onlineUsers.find(u => u.displayName == message.userToInvite);

  invite!.socket.send(JSON.stringify({
    event: "invite_player",
    gameId: message.gameId,
    sender: user.displayName,
    gameName: message.gameName
  }));
}

function broadcastMessage(message: any, userId: number) {
  const dm = userId != 0 ? parseMessage(message.content, userId) : undefined;

  const event: any = {
    event: "broadcast_message",
    sender: userId == 0 ? "" : getDisplayName(userId),
    senderId: userId
  };

  for (let entry of onlineUsers) {
    if (userId == entry.id)
      continue;

    if (userId != 0) {
      event.isDm = dm != undefined;
      event.isBlocked = getBlocked(entry.id).includes(userId);
      if (dm) {
        if (entry.displayName != dm.user)
          continue;
        entry.socket.send(JSON.stringify({
          ...event,
          content: dm.content
        }));
      } else {
        entry.socket.send(JSON.stringify({
          ...event,
          content: event.isBlocked ? "Blocked message" : message.content,
        }));
      }
    } else {
      entry.socket.send(JSON.stringify({
        ...event,
        content: message,
        isBlocked: false,
        isDm: false
      }));
    }
  }
}

function parseMessage(message: string, userId: number) {
  if (!message.startsWith("#"))
    return undefined;

  let i = 1;
  let tempName = "";

  while (i < message.length && message[i] !== " ") {
    tempName += message[i];
    i++;
  }

  i++;

  if (getUserID(tempName) == undefined || getUserID(tempName) == userId)
    return undefined;

  return { user: tempName, content: message.slice(i) };
}

//block
function swapBlocked(socket: WebSocket, userId: number, blockedId: number) {
  const blockedList = getBlocked(userId);

  if (!blockedId || userId == blockedId) {
    socket.send(JSON.stringify({
      event: "swap_blocked",
      success: false
    }));
    return;
  }

  const isBlocked = blockedList.includes(blockedId);

  let result;

  if (!isBlocked) {
    result = sqlite.prepare(`
      INSERT INTO blocked (userid, blockedid)
      VALUES (?, ?)
      ON CONFLICT(userid, blockedid) 
      DO NOTHING
    `).run(userId, blockedId);
  } else {
    result = sqlite.prepare("DELETE FROM blocked WHERE userid = ? AND blockedid = ?")
        .run(userId, blockedId);
  }

  socket.send(JSON.stringify({
    event: "swap_blocked",
    success: result.changes != 0
  }));
}

function getInfoDm(socket: WebSocket, userId: number, otherUser: string) {
  const otherId = getUserID(otherUser);
  socket.send(JSON.stringify({
    event: "get_dm_info",
    isBlocked: otherId && userId != otherId && getBlocked(userId).includes(otherId),
    id: otherId,
    isMe: otherUser == getDisplayName(userId),
    exists: otherId != undefined
  }));
}

function getBlocked(userId: number) {
  return sqlite.prepare(`SELECT u.id
    FROM blocked b
    JOIN users u ON b.blockedid = u.id
    WHERE b.userid = ?;
  `).all(userId).map((row: any) => row.id as number);
}

function getInfoProfile(user: User, userToGet: number) {
  const row: any = sqlite.prepare("SELECT * FROM users WHERE id = ?")
      .get(userToGet);

  const friends = getFriends(userToGet);

  user.socket.send(JSON.stringify({
    event: "get_info_profile",
    name: row.username,
    displayName: row.displayName,
    avatar: row.avatar,
    email: row.email,
    friends: friends,
    mainProfile: userToGet == user.id,
    status: !!onlineUsers.find(u => u.id == user.id),
    hideProfile: row.hideProfile,
  }));
}

function getGames(socket: WebSocket) {
  socket.send(JSON.stringify({ event: "get_games", games }));
}

function joinGame(user: User, message: any) {
  let game = games.find((g) => g.uid == message.uid);
  if (game == undefined) {
    broadcastMessage("The tournament " + message.name + " has been created! Come join it!", 0);
    games.push(game = new Game(message.name, message.uid));
    for (let user of onlineUsers)
      user.socket.send(JSON.stringify({ event: "get_games", games }));
  }
  if (!(game.players.find(u => u.name == user.displayName)))
    game.addUser(user);
}

function leaveGame(user: User) {
  user.game?.removeUser(user);
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

function getDisplayName(userId: number): string {
  const row: any = sqlite.prepare(`SELECT displayName
        FROM users WHERE id = ?`).get(userId);

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
