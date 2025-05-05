window.addEventListener('DOMContentLoaded', () => {
    window.init_scripts.forEach(scriptSrc => {
        const script = document.createElement('script');
        script.src = scriptSrc;
        document.body.appendChild(script);
    });
});

document.body.addEventListener('htmx:afterSwap', event => {
    if (event.target.id === 'pong-container' && event.detail.pathInfo.responsePath === "/pingpong/") {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
       link.href = '/static/pong/style.css';
       document.head.appendChild(link);

        initializePingPongGame()
    }
});

function initializePingPongGame() {
    window.game_scripts.forEach(scriptSrc => {
        const script = document.createElement('script');
        script.src = scriptSrc;
        document.body.appendChild(script);
    });
}

function toggleGame() {
    const button = document.getElementById("gameButton");

    const isPlaying = button.dataset.playing === "true";

    if (!isPlaying) {
        button.textContent = "Quitter le jeu";
        button.dataset.playing = "true";

        htmx.ajax('GET', "/choose_game/", {target: "#pong-container", swap: "innerHTML"});
    } else {
        button.textContent = "Lancer le jeu de ping-pong";
        button.dataset.playing = "false";

        htmx.ajax('GET', window.homeUrl, {target: "body", swap: "innerHTML"});
    }
}