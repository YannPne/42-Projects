window.game = null;
window.players = [];

function game_key(key, boolean)
{
    game.keys[key] = boolean;
}

function add_player()
{    
    let players = [];
    
    if (tournamentPlayers.length == 0)
    {
        players.push(new Player1("Player1"));
        players.push(new Player2IA());
        return players;
    }
    for (let i = 0; i < tournamentPlayers.length; i += 2)
    {
        if (tournamentPlayers[i] == "IA")
            players.push(new Player1IA());
        else
            players.push(new Player1(tournamentPlayers[i]));
            
        if ((i + 1) >= tournamentPlayers.length || tournamentPlayers[i + 1] == "IA")
            players.push(new Player2IA());
        else
            players.push(new Player2(tournamentPlayers[i + 1]));
        
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
    window.game.gameover = true;
    resetgame(window.players[0], window.players[1], 1);

    window.animationId = requestAnimationFrame(() => gameloop());
}