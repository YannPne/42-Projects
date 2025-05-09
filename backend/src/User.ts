import Player from "./Player";

export default class User {
  socket?: WebSocket;
  name: string;
  player?: Player; // Defined when linked to a game.

  constructor(name: string) {
    this.name = name;
  }
}