window.game = null;
window.players = [];
tournamentPlayers = [];

function game_key(key, isDown)
{
    game.keys[key] = isDown;
}

function set_speed(player)
{
    let middle_player_y = player.y + player.height / 2;
    ball.speed_y = (ball.y - middle_player_y) / game.angle;
    ball.speed_x = -ball.speed_x;
    if (ball.speed_x < 40 && ball.speed_x > 0)
        ball.speed_x += 0.6;
    else if (ball.speed_x > -40)
        ball.speed_x -= 0.6;
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

function add_player()
{
    let players = [];

    tournamentPlayers[0] ??= "Player1";
    for (let i = 0; i < tournamentPlayers.length; i += 2)
    {
        const player1 = tournamentPlayers[i] ?? "IA";
        const player2 = tournamentPlayers[i + 1] ?? "IA";
        players.push(Player.newPlayer(player1, true, player1 === "IA"));
        players.push(Player.newPlayer(player2, false, player2 === "IA"));
    }
    return players;
}

function set_game()
{
    if (!window.game)
    {
        window.game = new Game();
        window.players = add_player();
    }
    resetgame(window.players[0], window.players[1], true);
    window.animationId = requestAnimationFrame(() => gameloop());
}