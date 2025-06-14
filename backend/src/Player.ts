import { Game } from "./Game";

export default class Player {
  readonly width: number = 20;
  readonly height: number = 200;

  readonly game: Game;
  readonly name: string;
  readonly isAi: boolean;
  speed: number = 5;
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
    this.aiTargetY = ((Math.random() - 0.5) * 200) + game.height / 2;
    console.log(this.aiTargetY);
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

    if (this.goUp) this.y -= this.speed;
    if (this.goDown) this.y += this.speed;
    this.y = Math.min(Math.max(this.y, 0), this.game.height - this.height);
  }

  playAi() {
    const ball = this.game.ball;
    if (Date.now() - this.aiLastCheck >= 1_000) {
      this.aiLastCheck = Date.now();

      if (ball.speedX != 0 && ball.goToLeft == this.isAtLeft) {
        this.speed = 5;
        this.aiTargetY = ((this.isAtLeft
            ? this.right - ball.left
            : this.left - ball.right)
          * ball.speedY) / ball.speedX + ball.centerY;
        if (this.aiTargetY < 0)
          this.aiTargetY = (-this.aiTargetY) * 1.25;
        else if (this.aiTargetY > 600)
          this.aiTargetY = 600 - ((this.aiTargetY - 600) * 1.25);
        this.aiTargetY += (Math.random() - 0.5) * 50;
      }
      else
      {
        this.speed = 2;
        this.aiTargetY = ball.centerY;
      }
    }
    this.goUp = this.centerY > this.aiTargetY + (this.height / 4);
    this.goDown = this.centerY < this.aiTargetY - (this.height / 4);
    if (!this.goUp && !this.goDown && ball.goToLeft != this.isAtLeft) 
    {
      this.speed = 1;
      this.aiTargetY =  Math.floor(Date.now() / 500) % 2 === 0 ? 0 : this.game.height
    }
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
