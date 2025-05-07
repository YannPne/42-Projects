modal = document.getElementById("myModal");
openModalBtn = document.getElementById("openModalBtn");
closeModalBtn = document.getElementById("closeModalBtn");
addPlayerButton = document.getElementById('add-player');
add42PlayerButton = document.getElementById('add-42-player');
startButton = document.getElementById('start');
resetbutton = document.getElementById('reset');
playerNameInput = document.getElementById('player-name');
canvas = document.getElementById('pong');
context = canvas.getContext('2d');

window.animationId = null;


// Ouvrir la modale
openModalBtn.onclick = () => {
    modal.style.display = "block";
}

// Fermer la modale
closeModalBtn.onclick = () => {
    modal.style.display = "none";
}

// Fermer la modale si l'utilisateur clique en dehors de la modale
window.onclick = event => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

addPlayerButton.addEventListener("click", () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        ws.send(JSON.stringify({
            event: "add_player",
            name: playerName,
            is_ai: playerName === "IA"
        }));
        playerNameInput.value = '';
    }
});

add42PlayerButton.addEventListener("click", () => {
    let win = window.open("https://api.intra.42.fr/oauth/authorize"
        + "?client_id=u-s4t2ud-0a05cb1e9d70fbc329f27e221393b94744a04cc10bf200489c0273993074e3de"
        + "&redirect_uri=http://localhost:8000/api/auth/42/token" // TODO: https
        + "&scope=public"
        + "&response_type=code", "Connexion avec 42",
        "width=600,height=700,top=100,left=100");

    if (win == null)
        alert("Ouverture de la popup de connexion refuse");
    else {
        localStorage.removeItem("oauth");
        const interval = setInterval(() => {
            const json = JSON.parse(localStorage.getItem("oauth"));
            if (!json)
                return;
            localStorage.removeItem("oauth");
            clearInterval(interval);
            if (json.status === "success") {
                const playerName = json.name;
                tournamentPlayers.push(playerName);
                console.log("Joueur ajouté:", playerName);
                playerNameInput.value = '';
            } else
                alert("Connexion refuse");
        }, 500);
    }
});

startButton.addEventListener("click", () => {
    ws.send(JSON.stringify({
        event: "start"
    }));
});

resetbutton.addEventListener("click", () => {

});

function key_handle(event, up) {
    let send = {};

    let speed = 0;

    if (event.key === "w" || event.key === "z" || event.key === "ArrowUp")
        send.up = !up;
    else if (event.key === "s" || event.key === "ArrowDown")
        send.down = !up;
    else
        return;

    send.id = event.key === "ArrowUp" || event.key === "ArrowDown" ? 1 : 0;
    send.event = "move";

    ws.send(JSON.stringify(send));
}

document.addEventListener("keydown", event => {
    if (event.repeat)
        return;
    key_handle(event, false);
});

document.addEventListener("keyup", event => {
    key_handle(event, true);
});