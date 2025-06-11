import User from "../User";
import { ClientEvent } from "@ft_transcendence/core";
import { sqlite } from "../index";

const inChatUsers: User[] = [];

export default function chatEvents(user: User, message: ClientEvent) {
  if (message.event === "init_chat")
    initChat(user);
  else if (message.event === "message")
    onMessage(user, message);
  else if (message.event == "leave_chat")
    leaveChat(user);
  else if (message.event == "swap_block")
    block(user, message);
  else
    return false;

  return true;
}

function initChat(user: User) {
  const friends = sqlite.prepare("SELECT friendid FROM friends WHERE userid = ?")
    .all(user.id).map((f: any) => f.friendid as number);
  const blocked = sqlite.prepare("SELECT blockedid FROM blocked WHERE userid = ?")
    .all(user.id).map((b: any) => b.blockedid as number);

  inChatUsers.push(user);

  user.send({
    event: "init_chat",
    id: user.id,
    friends: friends,
    blocked: blocked,
    online: inChatUsers.map(u => ({
      id: u.id,
      name: u.displayName,
      avatar: u.avatar?.toJSON().data
    }))
  });

  inChatUsers.filter(u => u != user).forEach(u => u.send({
    event: "enter_chat",
    id: user.id,
    name: user.displayName,
    avatar: user.avatar?.toJSON().data
  }));
}

function onMessage(user: User, event: ClientEvent & { event: "message" }) {
  let send: User[] = inChatUsers;

  if (event.to != undefined) {
    send = send.filter(u => u.id == event.to);
    user.send({
      event: "message", from: event.to, message: {
        type: "message", sender: user.id, content: event.message.content
      }
    });
  }

  for (let s of send) {
    s.send({
      event: "message", from: event.to == undefined ? undefined : user.id, message: {
        type: "message", sender: user.id, content: event.message.content
      }
    });
  }
}

export function leaveChat(user: User) {
  if (!inChatUsers.some(u => u == user))
    return;

  inChatUsers.filter(u => u != user).forEach(u => u.send({
    event: "leave_chat",
    id: user.id
  }));

  inChatUsers.splice(inChatUsers.indexOf(user), 1);
}

function block(user: User, message: ClientEvent & { event: "swap_block" }) {
  if (message.block) {
    sqlite.prepare("INSERT INTO blocked(userid, blockedid) VALUES (?, ?)")
      .run(user.id, message.user);
  } else {
    sqlite.prepare("DELETE FROM blocked WHERE userid = ? AND blockedid = ?")
      .run(user.id, message.user);
  }
}
