import { Game } from "./Game";

export default class Player {
  readonly width: number = 20;
  readonly height: number = 200;

  readonly game: Game;
  readonly name: string;
  readonly isAi: boolean;
  x: number = 0;
  y: number = 0;
  goUp: boolean = false;
  goDown: boolean = false;
  score: number = 0;

  aiLastCheck: number = Date.now() - 1000;
  aiTargetY: number = 0;

  constructor(game: Game, name: string, isAi: boolean) {
    this.game = game;
    this.name = name;
    this.isAi = isAi;
  }

  get isAtLeft() {
    return this.x - this.game.width / 2 < 0;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  get centerX() {
    return this.x + this.width / 2;
  }

  get centerY() {
    return this.y + this.height / 2;
  }

  move() {
    if (this.isAi) this.playAi();

    if (this.goUp) this.y -= 5;
    if (this.goDown) this.y += 5;
    this.y = Math.min(Math.max(this.y, 0), this.game.height - this.height);
  }

  playAi() {
    if (Date.now() - this.aiLastCheck >= 1_000) {
      this.aiLastCheck = Date.now();

      const ball = this.game.ball;
      if (ball.speedX != 0 && ball.goToLeft == this.isAtLeft) {
        this.aiTargetY = ((this.isAtLeft
            ? this.right - ball.left
            : this.left - ball.right)
          * ball.speedY) / ball.speedX + ball.centerY;
      }
    }

    if (this.aiTargetY < 0)
      this.aiTargetY = (-this.aiTargetY) * 1.25;
    else if (this.aiTargetY > 600)
      this.aiTargetY = 600 - ((this.aiTargetY - 600) * 1.25);

    this.goUp = this.centerY > this.aiTargetY + (this.height / 4);
    this.goDown = this.centerY < this.aiTargetY - (this.height / 4);
  }

  toJSON() {
    return {
      name: this.name,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      score: this.score
    };
  }
}
