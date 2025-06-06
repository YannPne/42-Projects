import { FastifyRequest } from "fastify";
import User from "./User";
import { Game, games, GameState } from "./Game";
import { sqlite } from ".";
import { generateRandomSecret, getTotpCode } from "./2fa";
import bcrypt from "bcrypt";
import { ClientEvent } from "@ft_transcendence/core";
import { RunResult } from "better-sqlite3";

export let onlineUsers: User[] = [];

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  const row: any = sqlite.prepare("SELECT username, displayName, avatar, secret2fa FROM users WHERE id = ?")
    .get(req.jwtUserId);

  if (row == undefined) {
    socket.close();
    return;
  }

  const user = new User(req.jwtUserId, row.username, row.displayName, socket);
  onlineUsers.push(user);
  let secret2fa: string | undefined = row.secret2fa ?? undefined;

  user.send({
    event: "connected",
    displayName: row.displayName,
    avatar: (row.avatar as Buffer | null)?.toJSON().data
  });

  socket.addEventListener("close", () => {
    onlineUsers.splice(onlineUsers.indexOf(user), 1);
    user.game?.removeUser(user);
  });

  socket.addEventListener("message", async (event) => {
    const message: ClientEvent = JSON.parse(event.data);
    switch (message.event) {
      case "get_games":
        getGames(user);
        break;
      case "join_game":
        joinGame(user, message);
        break;
      case "leave_game":
        leaveGame(user);
        break;
      case "add_friend":
        addFriend(user, message);
        break;
      case "hide_profile":
        setHideProfile(user.id, message.hide);
        break;
      case "remove_friend":
        removeFriend(user, message.id);
        break;
      case "broadcast_message":
        broadcastMessage(message, user.id);
        break;
      case "swap_blocked":
        swapBlocked(user, message.id);
        break;
      case "get_dm_info":
        getInfoDm(user, message.otherUser);
        break;
      case "get_profile":
        getProfile(user, message.id ?? user.id);
        break;
      case "get_tournament":
        const tournament: string[] = user.game?.players.map(u => u.name)!;
        console.log(tournament);
        user.send({ event: "get_tournament", tournament });
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
        updateInfo(user, message);
        break;
      case "remove_account":
        const success = removeAccount(user.id);
        user.send({ event: "remove_account", success });
        if (success)
          socket.close();
        break;
      case "setup_2fa":
        const secret = setup2fa(user, secret2fa, message);
        if (secret != undefined)
          secret2fa = secret;
        break;
      case "setup_2fa_check":
        await check2fa(user, secret2fa, message);
        break;
      case "get_settings":
        getSettings(user);
        break;
    }
  });
}

function setHideProfile(userId: number, hide: boolean) {
  sqlite.prepare("UPDATE users SET hideProfile = ? WHERE id = ?")
    .run(hide ? 1 : 0, userId);
}

function updateInfo(user: User, message: ClientEvent & { event: "update_info" }) {
  let result: undefined | RunResult;

  if (message.avatar != undefined) {
    result = sqlite.prepare("UPDATE users SET avatar = ? WHERE id = ?")
      .run(Buffer.from(message.avatar), user.id);
  }
  if (message.username != undefined) {
    try {
      result = sqlite.prepare("UPDATE users SET username = ? WHERE id = ?").run(message.username, user.id);
      if (result.changes > 0)
        user.username = message.username;
    } catch (e) {}
  }
  if (message.displayName != undefined) {
    try {
      result = sqlite.prepare("UPDATE users SET displayName = ? WHERE id = ?").run(message.displayName, user.id);
      if (result.changes > 0)
        user.displayName = message.displayName;
    } catch (e) {}
  }
  if (message.email != undefined) {
    try {
      result = sqlite.prepare("UPDATE users SET email = ? WHERE id = ?").run(message.email, user.id);
    } catch (e) {}
  }
  if (message.password != undefined)
    result = sqlite.prepare("UPDATE users SET password = ? WHERE id = ?").run(bcrypt.hashSync(message.password, 10), user.id);

  user.send({ event: "update_info", success: result != undefined && result.changes > 0 });
}

function removeAccount(userId: number) {
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

function removeFriend(user: User, friend: number) {
  const result = sqlite.prepare("DELETE FROM friends WHERE userid = ? AND friendid = ?")
    .run(user.id, friend);

  user.send({
    event: "remove_friend",
    success: result.changes != 0
  });
}

function addFriend(user: User, message: ClientEvent & { event: "add_friend" }) {
  const friendId = getUserID(message.name);

  if (!friendId || user.id == friendId) {
    user.send({
      event: "add_friend",
      success: false
    });
    return;
  }

  const result = sqlite.prepare(`
      INSERT INTO friends (userid, friendid)
      SELECT ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM friends WHERE userid = ? AND friendid = ?)
  `).run(user.id, friendId, user.id, friendId);

  user.send({
    event: "add_friend",
    success: result.changes != 0
  });
}

function invitePlayer(user: User, message: ClientEvent & { event: "invite_player" }) {
  onlineUsers.find(u => u.displayName == message.userToInvite)?.send({
    event: "invite_player",
    gameId: message.gameId,
    gameName: message.gameName,
    sender: user.displayName,
    senderId: user.id
  });
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
          content: event.isBlocked ? "Blocked message" : message.content
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
function swapBlocked(user: User, blockedId: number) {
  const blockedList = getBlocked(user.id);

  if (!blockedId || user.id == blockedId) {
    user.send({
      event: "swap_blocked",
      success: false
    });
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
    `).run(user.id, blockedId);
  } else {
    result = sqlite.prepare("DELETE FROM blocked WHERE userid = ? AND blockedid = ?")
      .run(user.id, blockedId);
  }

  user.send({
    event: "swap_blocked",
    success: result.changes != 0
  });
}

function getInfoDm(user: User, otherUser: string) {
  const otherId = getUserID(otherUser);
  user.send({
    event: "get_dm_info",
    isBlocked: otherId != undefined && user.id != otherId && getBlocked(user.id).includes(otherId),
    id: otherId ?? 0,
    isMe: otherUser == getDisplayName(user.id),
    exists: otherId != undefined
  });
}

function getBlocked(userId: number) {
  return sqlite.prepare(`SELECT u.id
    FROM blocked b
    JOIN users u ON b.blockedid = u.id
    WHERE b.userid = ?;
  `).all(userId).map((row: any) => row.id as number);
}

function getProfile(user: User, userToGet: number) {
  let row: any = sqlite.prepare(`
    SELECT
      json_object(
        'id', u.id,
        'displayName', u.displayName,
        'username', u.username,
        'email', u.email,
        'avatar', CASE WHEN u.avatar IS NULL THEN NULL ELSE lower(hex(u.avatar)) END,
        'friends', (
          SELECT json_group_array(
            json_object(
              'id', uf.id,
              'displayName', uf.displayName,
              'avatar', CASE WHEN uf.avatar IS NULL THEN NULL ELSE lower(hex(uf.avatar)) END
            )
          )
          FROM friends f
          JOIN users uf ON f.friendid = uf.id AND f.userid = u.id
        ),
        'games', (
          SELECT json_group_array(
            CASE WHEN g.name1 = ug.displayName THEN
              json_object(
                'type', 'game',
                'opponent', g.name2,
                'selfScore', g.score1,
                'opponentScore', g.score2,
                'date', g.date
              )
            ELSE
              json_object(
                'type', 'game',
                'opponent', g.name1,
                'selfScore', g.score2,
                'opponentScore', g.score1,
                'date', g.date
              )
            END
          )
          FROM games g
          JOIN users ug ON g.name1 = ug.displayName OR g.name2 = ug.displayName
          WHERE g.name1 = u.displayName OR g.name2 = u.displayName
        )
      ) AS data, u.hideProfile
    FROM users u
    WHERE u.id = ?`).get(userToGet);

  row.data = JSON.parse(row.data);

  if (row.hideProfile && user.id != userToGet)
    user.send({ event: "get_profile", locked: true, displayName: row.data.displayName });
  else {
    row = row.data;
    row.event = "get_profile";
    row.locked = false;
    row.self = user.id == userToGet;
    row.online = onlineUsers.some(u => u.id == userToGet);
    if (row.avatar == null)
      row.avatar = undefined;
    else
      row.avatar = Buffer.from(row.avatar, "hex").toJSON().data;
    for (let friend of row.friends) {
      friend.online = onlineUsers.some(u => u.id == friend.id);
      if (friend.avatar == null)
        friend.avatar = undefined;
      else
        friend.avatar = Buffer.from(friend.avatar, "hex").toJSON().data;
    }

    user.send(row);
  }
}

function getGames(user: User) {
  user.send({ event: "get_games", games });
}

function joinGame(user: User, message: ClientEvent & { event: "join_game" }) {
  let game = games.find((g) => g.uid == message.uid);
  if (game == undefined) {
    broadcastMessage("The tournament " + message.name + " has been created! Come join it!", 0);
    games.push(game = new Game(message.name!, message.uid));
    for (let user of onlineUsers)
      user.send({ event: "get_games", games });
  }

  const names = game.players.map(p => p.name);
  for (const u of game.users)
    u.send({ event: "get_tournament", tournament: names });
  if (!(game.players.some(u => u.name == user.displayName)))
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

function addLocalPlayer(user: User, message: any) {
  if (!user.game) return;

  user.game.addLocalPlayer(message.name, message.isAi ? undefined : user);

  const names = user.game?.players.map(p => p.name);
  for (const u of user.game.users)
    u.send({ event: "get_tournament", tournament: names });
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

function setup2fa(user: User, secret: string | undefined, message: ClientEvent & { event: "setup_2fa" }) {
  if (message.enable) {
    secret = generateRandomSecret();
    user.send({ event: "setup_2fa", secret, username: user.username });
    return secret;
  } else {
    sqlite.prepare("UPDATE users SET secret2fa = NULL WHERE id = ?")
      .run(user.id);
  }
}

async function check2fa(user: User, secret: string | undefined, message: ClientEvent & { event: "setup_2fa_check" }) {
  if (secret == undefined)
    return;

  const success = await getTotpCode(secret) == message.code;
  if (success) {
    sqlite.prepare("UPDATE users SET secret2fa = ? WHERE id = ?")
      .run(secret, user.id);
  }
  user.send({ event: "setup_2fa_check", success });
}

function getSettings(user: User) {
  const row: any = sqlite.prepare("SELECT username, displayName, email, hideProfile, avatar, secret2fa FROM users WHERE id = ?")
    .get(user.id);

  user.send({
    event: "get_settings",
    username: row.username,
    displayName: row.displayName,
    email: row.email,
    hidden: row.hideProfile,
    avatar: (row.avatar as Buffer | null)?.toJSON().data,
    enabled2fa: row.secret2fa != null
  });
}
