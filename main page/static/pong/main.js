window.ball = {
    speed_x: 3,
    speed_y: 0,
    size: 50,
    move: false,
    x: 0,
    y: 0
};

function drawEndGame()
{
    if (game.scorePlayer1 == game.scoremax || game.scorePlayer2 == game.scoremax) 
    {
        game.gamecount++;
        game.endgame = true;
        window.ball.move = false;

        context.font = '80px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        let player_win = game.scorePlayer1 > game.scorePlayer2 ? player1 : player2;

        const message = player_win.name + " win";

        players.push(player_win); // global var tournament

        context.fillText(message, canvas.width / 2, canvas.height / 4);

        return (1);
    }
    return (0);
}



function check_impact(player1, player2)
{
    if (window.ball.x + window.ball.size > canvas.width || window.ball.x < 0)
    {
        if (window.ball.x + window.ball.size > canvas.width)
            game.scorePlayer1++;
        else
            game.scorePlayer2++;
        return (game.gameover = true);
    }

    if (window.ball.y + window.ball.size > canvas.height || window.ball.y < 0) // Impact TOP / BOTTOM
        window.ball.speed_y = -window.ball.speed_y;
    else if (window.ball.x < (player1.x + player1.width) && window.ball.y + window.ball.size > player1.y && window.ball.y < (player1.y + player1.height)) // Impact player 1
        set_speed(player1);
    else if ((window.ball.x + window.ball.size) > player2.x && window.ball.y + window.ball.size > player2.y && window.ball.y < (player2.y + player2.height)) // Impact player 2
        set_speed(player2);
}

function drawsmap()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
    context.setLineDash([10, 15]);
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.strokeStyle = '#ffffff44';
    context.lineWidth = 4;
    context.stroke();
    context.setLineDash([]);
    context.shadowBlur = 20;
    context.shadowColor = 'pink';

}

function drawsball()
{    
    if (window.ball.move)
    {
        if (window.ball.speed_x > 0)
            window.ball.x += window.ball.speed_x;
        else
            window.ball.x += window.ball.speed_x;
    
        window.ball.y += window.ball.speed_y / 2;
    }
    
    const drawX = Math.round(window.ball.x + window.ball.size / 2);
    const drawY = Math.round(window.ball.y + window.ball.size / 2);    

    context.beginPath();
    context.arc(drawX, drawY, window.ball.size / 2, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();

}

function move(player1, player2)
{
    player1.speed = 0;
    player2.speed = 0;

    if (game.keys["z"])
        player1.speed = -game.speed;
    if (game.keys["s"])
        player1.speed = game.speed;
    if (game.keys["ArrowUp"])
        player2.speed = -game.speed;
    if (game.keys["ArrowDown"])
        player2.speed = game.speed;
}

function drawScore(player1, player2) {
    context.font = '32px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.globalAlpha = 1;

    context.fillText(player1.name, canvas.width / 4, 20);
    context.fillText(player2.name, canvas.width * 3 / 4, 20);

    context.font = '150px Arial';
    context.textBaseline = 'middle';
    context.globalAlpha = 0.4;

    context.fillText(game.scorePlayer1, canvas.width / 4, canvas.height / 2);
    context.fillText(game.scorePlayer2, canvas.width * 3 / 4, canvas.height / 2);

    context.globalAlpha = 1;
}

function resetgame(player1, player2, boolean)
{
    if (boolean)
        console.log("test");
    if (game.gameover || boolean)
    {
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (game.scorePlayer1 > game.scorePlayer2)
            window.ball.speed_x = 5;
        else
            window.ball.speed_x = -5;
        window.ball.speed_y = 0;
        window.ball.x =  (canvas.width - window.ball.size) / 2;
        window.ball.y =  (canvas.height - window.ball.size) / 2;
        player1.x = 50;
        player1.y = canvas.height / 2 - player1.height / 2;
        player2.x = canvas.width - 50;
        player2.y = canvas.height / 2 - player1.height / 2;
        drawsmap();
        player1.drawplayer();
        player2.drawplayer();
        game.gameover = false;
    }
}

function gameloop()
{
    if (window.animationId == -1)
        return (pause());
    if (!window.animationId)
        return (resetgame(window.players[0], window.players[1], 1));
    if (game.endgame)
        return new_game();

    // player1 = window.players[0];
    // player2 = window.players[1];
    game = window.game;
    
    resetgame(window.players[0], window.players[1], 0);
    drawsmap();
    drawScore(window.players[0], window.players[1]);
    window.players[0].drawplayer();
    window.players[1].drawplayer();
    drawEndGame(window.players[0], window.players[1]);
    drawsball();
    move(window.players[0], window.players[1]);
    check_impact(window.players[0], window.players[1]);
    
    if (window.players[0] instanceof Player1IA)
        window.players[0].IA();
    if (window.players[1] instanceof Player2IA)
        window.players[1].IA();

    requestAnimationFrame(() => gameloop());
}

drawsmap();