function wsMessages(event) {
    let content = JSON.parse(event.data);

    switch (content.event) {
        case "update":
            drawsmap();
            for (let player of content.players)
                drawplayer(player);
            drawScore(content.players[0], content.players[1]);
            drawsball(content.ball);
            break;
        case "win":
            drawEndGame(content.player);
            break;
    }
}

function swap(path) {
    htmx.ajax('GET', path, {target: "#pong-container", swap: "innerHTML"});
}

document.onclick = event => {
    if (event.target.tagName.toLocaleLowerCase() === "a") {
        event.preventDefault();
        swap(event.target.href);
    }
};