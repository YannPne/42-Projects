function set_speed(player)
{
    middle_player_y = player.y + player.height / 2;
    ball.speed_y = (ball.y - middle_player_y) / game.angle;
    ball.speed_x = -ball.speed_x;
    if (ball.speed_x < 40 && ball.speed_x > 0)
        ball.speed_x += 0.6;
    else if (ball.speed_x > -40)
        ball.speed_x -= 0.6;
}

function pause()
{
    context.font = '80px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('Pause', canvas.width / 2, canvas.height / 4);
}

function new_game()
{
    players.splice(0, 2);
    if (players.length >= 2)
    {
        window.game = new Game();
        game.gameover = true;
        game.endgame = 0;
        set_game();
    }
}