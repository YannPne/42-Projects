window.ball = {
    speed_x: 3,
    speed_y: 0,
    size: 50,
    move: false,
    x: 0,
    y: 0
};

function drawEndGame(player1, player2)
{
    if (game.scorePlayer1 === game.scoremax || game.scorePlayer2 === game.scoremax)
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

function drawsmap()
{
    // TODO: sometimes context is undefined without graphics issues
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

    if (game.keys["z"] || game.keys["w"])
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

// TODO: player1 and player2 is undefined when follow this steps:
//    - A player win
//    - Click on 'Quitter le jeu'
//    - Click on 'Lancer le jeu de ping-pong'
//    - Click on 'Start game'
function resetgame(player1, player2, boolean)
{
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
    let player1 = window.players[0];
    let player2 = window.players[1];
    let game = window.game;

    if (window.animationId === -1)
        return ;
    if (!window.animationId)
        return (resetgame(player1, player2, true));
    if (game.endgame)
        return new_game();

    resetgame(player1, player2, false);
    drawsmap();
    drawScore(player1, player2);
    player1.drawplayer();
    player2.drawplayer();
    drawEndGame(player1, player2);
    drawsball();
    move(player1, player2);
    check_impact(player1, player2);

    if (player1.isAI)
        player1.IA();
    if (player2.isAI)
        player2.IA();

    requestAnimationFrame(() => gameloop());
}

drawsmap();