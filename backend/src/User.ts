import Player from "./Player";
import { Game } from "./Game";

export default class User {
  socket?: WebSocket;
  name: string;
  game?: Game;
  /**
   * Can contain multiple players when they are local players.
   */
  players: Player[] = [];

  constructor(name: string) {
    this.name = name;
  }
}