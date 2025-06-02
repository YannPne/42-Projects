import Player from "./Player";
import { Game } from "./Game";
import { ServerEvent } from "@ft_transcendence/core";

export default class User {
  socket: WebSocket;
  id: number;
  username: string;
  displayName: string;
  game?: Game;
  /**
   * Can contain multiple players when they are local players.
   */
  players: Player[] = [];

  constructor(id: number, username: string, displayName: string, socket: WebSocket) {
    this.id = id;
    this.username = username;
    this.displayName = displayName;
    this.socket = socket;
  }

  send(data: ServerEvent) {
    this.socket.send(JSON.stringify(data));
  }
}
