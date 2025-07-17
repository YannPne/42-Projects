import { FastifyRequest } from "fastify";
import User from "../User";
import { sqlite } from "../index";
import { ClientEvent } from "@ft_transcendence/core";
import gameEvents from "./game";
import profileEvents from "./profile";
import settingsEvents from "./settings";
import chatEvents, { leaveChat } from "./chat";

export let onlineUsers: User[] = [];

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  const row: any = sqlite.prepare("SELECT username, displayName, avatar, secret2fa FROM users WHERE id = ?")
    .get(req.jwtUserId);

  if (row == undefined) {
    socket.close();
    return;
  }

  const user = new User(req.jwtUserId, row.username, row.displayName, row.avatar ?? undefined, socket);
  onlineUsers.push(user);

  user.send({
    event: "connected",
    displayName: row.displayName,
    avatar: (row.avatar as Buffer | null)?.toJSON().data
  });

  socket.onclose = () => {
    onlineUsers.splice(onlineUsers.indexOf(user), 1);
    leaveChat(user);
    user.game?.removeUser(user);
  };

  socket.onmessage = async (event) => {
    const message: ClientEvent = JSON.parse(event.data);
    if (!(gameEvents(user, message)
      || profileEvents(user, message)
      || await settingsEvents(user, message)
      || chatEvents(user, message))) {
      console.error("Unexpected message event: " + message.event);
    }
  };
}
