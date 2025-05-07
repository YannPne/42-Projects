function drawEndGame(player) {
    context.font = '80px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const message = player + " win";
    context.fillText(message, canvas.width / 2, canvas.height / 4);
}

function drawsmap() {
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

function drawplayer(player) {
    context.fillStyle = 'white';
    context.fillRect(player.x, player.y, player.width, player.height);
}

function drawsball(ball) {
    const drawX = Math.round(ball.x + ball.size / 2);
    const drawY = Math.round(ball.y + ball.size / 2);

    context.beginPath();
    context.arc(drawX, drawY, ball.size / 2, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();
}

function move(player1, player2) {
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

    context.fillText(player1.score, canvas.width / 4, canvas.height / 2);
    context.fillText(player2.score, canvas.width * 3 / 4, canvas.height / 2);

    context.globalAlpha = 1;
}