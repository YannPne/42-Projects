import { Game } from "./Game";
import User from "./User";

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

  aiLastCheck: number = Date.now();
  aiTargetY: number = 0;

  constructor(game: Game, name: string, isAi: boolean) {
    this.game = game;
    this.name = name;
    this.isAi = isAi;
  }

  move() {
    if (this.isAi)
      this.playAi();

    if (this.goUp)
      this.y -= 5;
    if (this.goDown)
      this.y += 5;
    this.y = Math.min(Math.max(this.y, 0), this.game.height - this.height);
  }

  playAi() {
    if (Date.now() - this.aiLastCheck >= 1_000) {
      this.aiLastCheck = Date.now();

      const ball = this.game.ball;
      if (ball.speedX != 0 && ball.speedX * (this.x - this.game.width / 2) >= 0) {
        let ballX = ball.x;
        if (this.x > this.game.width / 2)
          ballX += ball.size;
        const ballY = ball.y + ball.size / 2;
        this.aiTargetY = (this.x - ballX) * ball.speedY / ball.speedX + ballY;
      }
    }

    const centerY = this.y + this.height / 2;
    this.goUp = centerY > this.aiTargetY + 30;
    this.goDown = centerY < this.aiTargetY - 30;
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
