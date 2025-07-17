import { Game, Match } from "./Game";
import Player from "./Player";

export default class Ball {
  static readonly ANGLE = 25;
  static readonly SIZE = 50;

  private readonly game: Game;
  private x: number = 0;
  private y: number = 0;
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
    return this.x + Ball.SIZE;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + Ball.SIZE;
  }

  get centerX() {
    return this.x + Ball.SIZE / 2;
  }

  get centerY() {
    return this.y + Ball.SIZE / 2;
  }

  resetPos(match: Match & { player2: Player }) {
    this.x = (Game.WIDTH - Ball.SIZE) / 2;
    this.y = (Game.HEIGHT - Ball.SIZE) / 2;
    this.speedX = match.score1 < match.score2 ? -3 : 3;
    this.speedY = 0;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  updateSpeed(player1: Player, player2: Player) {
    if (this.bottom >= Game.HEIGHT || this.top <= 0) this.speedY *= -1;
    else if (this.goToLeft && this.left <= player1.right && this.bottom >= player1.top && this.top < player1.bottom)
      this.impactPlayer(player1);
    else if (!this.goToLeft && this.right >= player2.left && this.bottom >= player2.top && this.top < player2.bottom)
      this.impactPlayer(player2);
  }

  impactPlayer(player: Player) {
    this.speedX *= -1;
    this.speedY = ((this.y + Ball.SIZE / 3) - player.centerY) / Ball.ANGLE;
    if (this.speedX > 0 && this.speedX < 40)
      this.speedX += 0.6;
    else if (this.speedX > -40)
      this.speedX -= 0.6;
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      size: Ball.SIZE
    };
  }
}
