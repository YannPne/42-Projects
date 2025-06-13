import { ClientEvent, Game } from "@ft_transcendence/core";
import User from "../User";
import { sqlite } from "../index";
import { onlineUsers } from "./websocket";

export default function profileEvents(user: User, message: ClientEvent) {
  if (message.event == "get_profile")
    getProfile(user, message.id ?? user.id);
  else if (message.event == "add_friend")
    addFriend(user, message);
  else if (message.event == "remove_friend")
    removeFriend(user, message);
  else
    return false;

  return true;
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
            json_object(
              'players', json_array(
                json_object(
                  'id', g.player1_id,
                  'name', CASE WHEN g.player1_id IS NULL THEN g.player1_name ELSE p1.displayName END,
                  'score', g.player1_score
                ),
                json_object(
                  'id', g.player2_id,
                  'name', CASE WHEN g.player2_id IS NULL THEN g.player2_name ELSE p2.displayName END,
                  'score', g.player2_score
                )
              ),
              'date', g.date
            )
          )
          FROM games g
          LEFT JOIN users p1 ON g.player1_id = p1.id
          LEFT JOIN users p2 ON g.player2_id = p2.id
          WHERE g.player1_id = u.id OR g.player2_id = u.id
        )
      ) AS data,
      u.hideProfile
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

    const games: Game[] = [];
    for (let game of row.games) {
      if (game.players[0].id == userToGet) {
        games.push({
          type: "game",
          opponent: game.players[1].name,
          selfScore: game.players[0].score,
          opponentScore: game.players[1].score,
          date: game.date
        });
      } else {
        games.push({
          type: "game",
          opponent: game.players[0].name,
          selfScore: game.players[1].score,
          opponentScore: game.players[0].score,
          date: game.date
        });
      }
    }

    row.games = games;

    user.send(row);
  }
}

function getUserID(name: string): number | undefined {
  const result: any = sqlite.prepare("SELECT id FROM users WHERE displayName = ?")
    .get(name);
  return result?.id;
}

function addFriend(user: User, message: ClientEvent & { event: "add_friend" }) {
  const id = typeof message.user == "number" ? message.user : getUserID(message.user);

  if (!id || user.id == id) {
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
  `).run(user.id, id, user.id, id);

  user.send({ event: "add_friend", success: result.changes > 0 });
}

function removeFriend(user: User, message: ClientEvent & { event: "remove_friend" }) {
  const result = sqlite.prepare("DELETE FROM friends WHERE userid = ? AND friendid = ?")
    .run(user.id, message.user);

  user.send({
    event: "remove_friend",
    success: result.changes != 0
  });
}
