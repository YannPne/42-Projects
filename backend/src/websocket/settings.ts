import User from "../User";
import { ClientEvent } from "@ft_transcendence/core";
import { sqlite } from "../index";
import { RunResult } from "better-sqlite3";
import bcrypt from "bcrypt";
import { generateRandomSecret, getTotpCode } from "../2fa";

export default async function settingsEvents(user: User, message: ClientEvent) {
  if (message.event === "get_settings")
    getSettings(user);
  else if (message.event === "update_info")
    updateInfo(user, message);
  else if (message.event === "setup_2fa")
    setup2fa(user, user.secret2fa, message);
  else if (message.event === "setup_2fa_check")
    await check2fa(user, user.secret2fa, message);
  else if (message.event === "hide_profile")
    setHideProfile(user.id, message.hide);
  else if (message.event === "remove_account")
    removeAccount(user);
  else
    return false;

  return true;
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

function updateInfo(user: User, message: ClientEvent & { event: "update_info" }) {
  let result: undefined | RunResult;

  if (message.avatar != undefined) {
    const buffer = Buffer.from(message.avatar);
    result = sqlite.prepare("UPDATE users SET avatar = ? WHERE id = ?")
      .run(buffer, user.id);
    if (result.changes > 0)
      user.avatar = buffer;
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

function setup2fa(user: User, secret: string | undefined, message: ClientEvent & { event: "setup_2fa" }) {
  if (message.enable) {
    secret = generateRandomSecret();
    user.send({ event: "setup_2fa", secret, username: user.username });
    user.secret2fa = secret;
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

function setHideProfile(userId: number, hide: boolean) {
  sqlite.prepare("UPDATE users SET hideProfile = ? WHERE id = ?")
    .run(hide ? 1 : 0, userId);
}

function getDisplayName(userId: number): string {
  const row: any = sqlite.prepare(`SELECT displayName
        FROM users WHERE id = ?`).get(userId);

  return row.displayName;
}

function removeAccount(user: User) {
  const name: string = getDisplayName(user.id);

  const result = sqlite.prepare("DELETE FROM users WHERE id = ?").run(user.id);
  sqlite.prepare(`UPDATE games
    SET name1 = CASE WHEN name1 = ? THEN ? ELSE name1 END,
        name2 = CASE WHEN name2 = ? THEN ? ELSE name2 END
    WHERE name1 = ? OR name2 = ?;
  `).run(name, "{Deleted User}", name, "{Deleted User}", name, name);

  user.send({ event: "remove_account", success: result.changes > 0 });
  if (result.changes > 0)
    user.socket.close();
}
