import Player from "./Player";
import { Game } from "./Game";

export default class User {
  socket: WebSocket;
  id: number;
  name: string;
  game?: Game;
  /**
   * Can contain multiple players when they are local players.
   */
  players: Player[] = [];

  constructor(id: number, name: string, socket: WebSocket) {
    this.id = id;
    this.name = name;
    this.socket = socket;
  }
}
