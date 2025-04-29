modal = document.getElementById("myModal");
openModalBtn = document.getElementById("openModalBtn");
closeModalBtn = document.getElementById("closeModalBtn");
addPlayerButton = document.getElementById('add-player');
startButton = document.getElementById('start');
resetbutton = document.getElementById('reset');
playerNameInput = document.getElementById('player-name');
canvas = document.getElementById('pong');
context = canvas.getContext('2d');

window.animationId = null;


// Ouvrir la modale
openModalBtn.onclick = function() 
{
  modal.style.display = "block";
}

// Fermer la modale
closeModalBtn.onclick = function() {
  modal.style.display = "none";
}

// Fermer la modale si l'utilisateur clique en dehors de la modale
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

addPlayerButton.addEventListener('click', function() {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
      tournamentPlayers.push(playerName);
      console.log("Joueur ajouté:", playerName);
      playerNameInput.value = ''; // Réinitialiser l'input
    }
  });

startButton.addEventListener('click', function() 
{
    if (window.animationId)
      return ;
    else
      set_game();
  });

resetbutton.addEventListener('click', function() {
  if (window.animationId)
    {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawsmap();
      window.animationId = 0;
      tournamentPlayers.length = 0;
      window.game = 0;
      window.player = 0;
    }
  });

document.addEventListener('keydown', function(event)
{
  if (window.game)
  {
    game_key(event.key, 1);
    ball.move = true;
  }
});

document.addEventListener('keyup', function(event)
{
  if (window.game)
  {
    game_key(event.key, 0);
  }
});