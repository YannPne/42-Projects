class Player 
{
    constructor(name, x, width = 20, height = 200, time_move = Date.now(), speed = 0, y = canvas.height / 2 - 200 / 2) 
    {
        this.time_move = time_move;
        this.name = name;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.target_y = this.y + this.height / 2;
    }

    drawplayer()
    {
        this.y += this.speed;

        if (this.y + this.height > canvas.height || this.y < 0)
            this.y -= this.speed;

        context.fillStyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    IA()
    {
        if ((this.time_move + 1000) < Date.now())
        {
            this.target_y = window.ball.y;
            this.time_move = Date.now();
        }

        let middle_player1_y = this.y + this.height / 2;
        
        // if (ball.speed_x < 0 && ball.x < canvas.width / 2) // ralentissement de l'ia pour la nerd
        //     this.speed = game.speed;
        // else if (ball.speed_x < 0)
        //     this.speed = game.speed / 2;
        // else
        //     this.speed = game.speed / 5;

        this.speed = game.speed

        if (middle_player1_y > this.target_y + 30) // 30 pour eviter le tramblement / taper avec les cotés
            this.speed = -this.speed;
        else if (middle_player1_y < this.target_y - 30)
            this.speed = this.speed;
        else 
            this.speed = 0;
    }
}

class Player1 extends Player 
{
    constructor(name) 
    {
        super(name, 50);
    }
}

class Player2 extends Player 
{
    constructor(name)
    {
        super(name, canvas.width - 50);
    }
}

class Player1IA extends Player1
{
    constructor()
    {
        super("IA");
    }
}

class Player2IA extends Player2
{
    constructor()
    {
        super("IA");
    }
}
