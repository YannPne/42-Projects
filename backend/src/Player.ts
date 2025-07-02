import { Game } from "./Game";

export default class Player {
  static readonly WIDTH = 20;
  static readonly HEIGHT = 200;

  readonly id: string;
  private readonly game: Game;
  readonly name: string;
  readonly isAi: boolean;
  private speed: number = 5;
  x: number = 0;
  y: number = 0;
  goUp: boolean = false;
  goDown: boolean = false;

  private aiLastCheck: number = Date.now();
  private aiTargetY: number = 0;

  constructor(game: Game, name: string, isAi: boolean) {
    this.id = crypto.randomUUID();
    this.game = game;
    this.name = name;
    this.isAi = isAi;
    this.aiTargetY = ((Math.random() - 0.5) * Player.HEIGHT) + Game.HEIGHT / 2;
  }

  get isAtLeft() {
    return this.x - Game.WIDTH / 2 < 0;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + Player.WIDTH;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + Player.HEIGHT;
  }

  get centerX() {
    return this.x + Player.WIDTH / 2;
  }

  get centerY() {
    return this.y + Player.HEIGHT / 2;
  }

  move() {
    if (this.isAi) this.playAi();

    if (this.goUp) this.y -= this.speed;
    if (this.goDown) this.y += this.speed;
    this.y = Math.min(Math.max(this.y, 0), Game.HEIGHT - Player.HEIGHT);
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
        else if (this.aiTargetY > Game.HEIGHT)
          this.aiTargetY = Game.HEIGHT - ((this.aiTargetY - Game.HEIGHT) * 1.25);
        this.aiTargetY += (Math.random() - 0.5) * 50;
      } else {
        this.speed = 2;
        this.aiTargetY = ball.centerY;
      }
    }
    this.goUp = this.centerY > this.aiTargetY + (Player.HEIGHT / 4);
    this.goDown = this.centerY < this.aiTargetY - (Player.HEIGHT / 4);
    if (!this.goUp && !this.goDown && ball.goToLeft != this.isAtLeft) {
      this.speed = 1;
      this.aiTargetY = Math.floor(Date.now() / 500) % 2 === 0 ? 0 : Game.HEIGHT;
    }
  }

  toJSON() {
    return {
      name: this.name,
      x: this.x,
      y: this.y,
      width: Player.WIDTH,
      height: Player.HEIGHT
    };
  }
}
