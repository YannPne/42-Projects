import Ball from "./Ball";
import Player from "./Player";

export let games: Game[] = [];

export enum GameState {
  CREATING, IN_GAME, SHOW_WINNER
}

export class Game {
  readonly winScore: number = 5;
  readonly width: number = 1200;
  readonly height: number = 600;

  readonly name: string;
  readonly uid: string;
  state: GameState = GameState.CREATING;
  ball: Ball = new Ball(this);
  players: Player[] = [];

  constructor(name: string, uid: string) {
    this.name = name;
    this.uid = uid;

    this.loop()
      .then(() => console.log("Game finished"))
      .catch(console.error);
  }

  checkWin() {
    let player: Player;

    if (this.ball.x < 0)
      player = this.players[0];
    else if (this.ball.x + this.ball.size > this.width)
      player = this.players[1];
    else
      return false;

    player.score++;
    if (player.score >= this.winScore) {
      this.players.splice(0, 2);
      this.players.push(player);
    }

    if (this.players.length == 1) {
      this.state = GameState.SHOW_WINNER;
      return true;
    }

    this.ball.resetPos();
    this.players[0].x = 30;
    this.players[0].y = (this.height - this.players[0].height) / 2;
    this.players[1].x = this.width - this.players[1].width - 30;
    this.players[1].y = (this.height - this.players[1].height) / 2;
    return true;
  }

  async loop() {
    while (this.state == GameState.CREATING) ;

    let [player1, player2] = this.players;

    player1.x = 30;
    player2.x = this.width - player2.width - 30;

    while (this.state == GameState.IN_GAME) {
      const startTime = Date.now();

      this.ball.move();
      player1.move();
      player2.move();
      this.ball.updateSpeed(player1, player2);

      if (this.checkWin()) {
        // @ts-ignore
        if (this.state == GameState.SHOW_WINNER)
          break;
        [player1, player2] = this.players;
      }

      for (let player of this.players) {
        player.user?.socket?.send(JSON.stringify({
          event: "update",
          ball: this.ball,
          players: [player1, player2]
        }));
      }

      await new Promise(res => setTimeout(res, 10 - (Date.now() - startTime)));
    }

    for (let player of this.players) {
      player.user?.socket?.send(JSON.stringify({
        event: "win",
        player: this.players[0].name
      }));
    }
  }
}
