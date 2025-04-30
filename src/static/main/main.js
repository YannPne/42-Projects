window.addEventListener('DOMContentLoaded', () =>
{
  window.init_scripts.forEach(function(scriptSrc)
  {
    const script = document.createElement('script');
    script.src = scriptSrc;
    document.body.appendChild(script);
  });
});

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
    }
    else
    {
      button.textContent = "Lancer le jeu de ping-pong";
      button.dataset.playing = "false";

      htmx.ajax('GET', window.homeUrl, { target: "body", swap: "innerHTML" });
    }
}