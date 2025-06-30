import Player from "./Player";
import { Game } from "./Game";
import { ServerEvent } from "@ft_transcendence/core";

export default class User {
  private readonly socket: WebSocket;
  readonly id: number;
  username: string;
  displayName: string;
  avatar?: Buffer;
  game?: Game;
  /**
   * Can contain multiple players when they are local players.
   */
  players: Player[] = [];

  /**
   * Temporary value used when the user setting up the 2FA.
   */
  secret2fa: string | undefined;

  constructor(id: number, username: string, displayName: string, avatar: Buffer | undefined, socket: WebSocket) {
    this.id = id;
    this.username = username;
    this.displayName = displayName;
    this.avatar = avatar;
    this.socket = socket;
  }

  send(data: ServerEvent) {
    this.socket.send(JSON.stringify(data));
  }

  closeSocket(code?: number, reason?: string) {
    this.socket.close(code, reason);
  }
}
