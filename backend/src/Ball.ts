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

  get goToLeft() {
    return this.speedX < 0;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.size;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.size;
  }

  get centerX() {
    return this.x + this.size / 2;
  }

  get centerY() {
    return this.y + this.size / 2;
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
    if (this.bottom >= this.game.height || this.top <= 0) this.speedY *= -1;
    else if (this.goToLeft && this.left <= player1.right && this.bottom >= player1.top && this.top < player1.bottom)
      this.impactPlayer(player1);
    else if (!this.goToLeft && this.right >= player2.left && this.bottom >= player2.top && this.top < player2.bottom)
      this.impactPlayer(player2);
  }

  impactPlayer(player: Player) {
    this.speedX *= -1;
    this.speedY = (this.y - player.centerY) / this.angle;
    if (this.speedX > 0 && this.speedX < 40)
      this.speedX += 0.6;
    else if (this.speedX > -40)
      this.speedX -= 0.6;
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      size: this.size,
    };
  }
}
