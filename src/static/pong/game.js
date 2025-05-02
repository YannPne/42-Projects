class Game {
    constructor(speed = 7, scoremax = 5, angle = 10)
    {
        this.gameover = true;
        this.endgame = false;
        this.angle = angle; // between 10 and 100 (100 = small angle)
        this.speed = speed; // player speed
        this.scoremax = scoremax;
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
        this.gamecount = 0;
        this.keys = {};
    }
}

