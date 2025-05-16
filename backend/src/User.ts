import Player from "./Player";

export default class User {
  socket?: WebSocket;
  id: number;
  name: string;
  player?: Player; // Defined when linked to a game.

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}