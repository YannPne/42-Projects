import { Game } from "./Game";
import Player from "./Player";

export default class Ball {
  readonly angle: number = 60;
  readonly size: number = 50;

  readonly game: Game;
  x: number = 0;
  y: number = 0;
  speedX: number = 0;
  speedY: number = 0;

  constructor(game: Game) {
    this.game = game;
  }

  resetPos() {
    this.x = (this.game.width - this.size) / 2;
    this.y = (this.game.height - this.size) / 2;
    const [player1, player2] = this.game.players;
    this.speedX = player1.score < player2.score ? -3 : 3;
    this.speedY = 0;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  updateSpeed(player1: Player, player2: Player) {
    if (this.y + this.size >= this.game.height || this.y <= 0)
      this.speedY *= -1;
    else if (this.speedX * (player1.x - this.game.width / 2) >= 0 && this.x <= player1.x + player1.width && this.y + this.size >= player1.y && this.y < player1.y + player1.height)
      this.impactPlayer(player1);
    else if (this.speedX * (player2.x - this.game.width / 2) >= 0 && this.x + this.size >= player2.x && this.y + this.size >= player2.y && this.y < player2.y + player2.height)
      this.impactPlayer(player2);
  }

  impactPlayer(player: Player) {
    this.speedX *= -1;
    this.speedY = (this.y - player.y - player.height / 2) / this.angle;
    if (this.speedX > 0 && this.speedX < 40)
      this.speedX += 0.6;
    else if (this.speedX > -40)
      this.speedX -= 0.6;
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      size: this.size
    }
  }
}
