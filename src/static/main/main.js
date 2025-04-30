test = false;

window.addEventListener('DOMContentLoaded', () => 
{
  window.init_scripts.forEach(function(scriptSrc)
    {
        const script = document.createElement('script');
        script.src = scriptSrc;
        document.body.appendChild(script);
    });
});

function prepareStartButton() {
  const oldButton = document.getElementById('start');
  const newButton = oldButton.cloneNode(true); // clone sans listeners
  oldButton.parentNode.replaceChild(newButton, oldButton);

  // Maintenant on ajoute le listener proprement
  newButton.addEventListener('click', function handleStartClick() {
    console.log("Start button clicked !");
    set_game(); // ton lancement de jeu
  });
}


document.body.addEventListener('htmx:afterSwap', function(event)
{
  // Vérifie si le contenu ajouté est celui du jeu Ping Pong
  if (event.target.id === 'pong-container')
  {
    // Ajouter dynamiquement le fichier CSS du jeu
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/static/pong/style.css';
    document.head.appendChild(link);

    initializePingPongGame()
  }
});

function initializePingPongGame()
{
    //if (!window.scripts) return;

    console.log("Le jeu de ping-pong est initialisé.");
    
    window.game_scripts.forEach(function(scriptSrc)
    {
        const script = document.createElement('script');
        script.src = scriptSrc;
        document.body.appendChild(script);
    });
}

function toggleGame()
{
    const button = document.getElementById("gameButton");

    const isPlaying = button.dataset.playing === "true";

    if (!isPlaying)
    {
      button.textContent = "Quitter le jeu";
      button.dataset.playing = "true";

      htmx.ajax('GET', window.pingPongUrl, { target: "#pong-container", swap: "innerHTML" });
      test = true;
    }
    else 
    {
      button.textContent = "Lancer le jeu de ping-pong";
      button.dataset.playing = "false";

      htmx.ajax('GET', window.homeUrl, { target: "body", swap: "innerHTML" });
      test = true;
    }
}