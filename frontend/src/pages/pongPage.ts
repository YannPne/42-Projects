import { loadPage, type Page } from "./Page.ts";
import { ws } from "../main.ts";
import type { Ball, Event, Player } from "../Event.ts";
import { chooseGamePage } from "./chooseGamePage.ts";

// TODO: Leave game

let wsListener: ((event: MessageEvent) => void) | undefined;
let keydownListener: ((event: KeyboardEvent) => void) | undefined;
let keyupListener: ((event: KeyboardEvent) => void) | undefined;

export const pongPage: Page = {
  url: "/pong",
  title: "Pong",
  navbar: false,

  getPage(): string {
    return `
      <div class="flex flex-col items-center justify-center h-full w-full p-5">
        <div class="pb-5 w-full flex justify-around">
          <button id="start" class="p-2 rounded-xl bg-blue-900 hover:bg-blue-950 cursor-pointer">Start game</button>
          <form id="addLocalForm" class="bg-gray-900 items-center justify-center">
            <input id="addLocalName" type="text" required placeholder="Local player's name" class="p-2 placeholder-gray-400">
            <label for="addLocalCheck">Is AI?</label>
            <input id="addLocalCheck" type="checkbox" required>
            <button class="p-2 bg-blue-900 hover:bg-blue-950">Add local player</button>
          </form>
        </div>
        <canvas id="game" width="1200" height="600" class="flex-1 overflow-hidden aspect-[2/1] bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950"></canvas>
      </div>
    `;
  },

  onMount(data?: any) {
    if (data != undefined) {
      ws!.send(JSON.stringify(data)); // join_game event
    } else {
      loadPage(chooseGamePage);
      return;
    }

    // Header
    const start = document.querySelector<HTMLButtonElement>("#start")!;
    const addLocalName = document.querySelector<HTMLInputElement>("#addLocalName")!;
    const addLocalCheck = document.querySelector<HTMLInputElement>("#addLocalCheck")!;
    const addLocalForm = document.querySelector<HTMLButtonElement>("#addLocalForm")!;
    // Game
    const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
    const context = canvas.getContext("2d")!;

    start.onclick = () => {
      ws!.send(JSON.stringify({ event: "play" }));
    };

    addLocalForm.onsubmit = event => {
      event.preventDefault();

      if (addLocalName.value.trim() != "") {
        ws!.send(JSON.stringify({ event: "add_local_player", name: addLocalName.value, isAi: addLocalCheck.checked }));
        addLocalName.value = "";
        addLocalCheck.checked = false;
      }
    };

    document.addEventListener("keydown", keydownListener = event => {
      if (!event.repeat)
        move(event, false);
    });

    document.addEventListener("keyup", keyupListener = event => {
      move(event, true);
    });

    ws!.addEventListener("message", wsListener = event => {
      const message: Event = JSON.parse(event.data);

      switch (message.event) {
        case "update":
          drawMap(canvas, context);
          for (let player of message.players)
            drawPlayer(context, player);
          drawBall(context, message.ball);
          drawScore(canvas, context, message.players[0], message.players[1]);
          break;
        case "win":
          drawEndGame(canvas, context, message.player);
          break;
      }
    });
  },

  onUnmount() {
    if (keydownListener != undefined)
      document.removeEventListener("keydown", keydownListener);
    if (keyupListener != undefined)
      document.removeEventListener("keyup", keyupListener);
    if (wsListener != undefined)
      ws?.removeEventListener("message", wsListener);
    keydownListener = undefined;
    keyupListener = undefined;
    wsListener = undefined;
  }
};

function move(event: KeyboardEvent, up: boolean) {
  let send: Partial<Event> = { event: "move" };

  if (event.code == "KeyW" || event.code == "ArrowUp")
    send.goUp = !up;
  else if (event.code == "KeyS" || event.code == "ArrowDown")
    send.goDown = !up;
  else
    return;

  send.id = event.code == "ArrowUp" || event.code == "ArrowDown" ? 1 : 0;

  ws?.send(JSON.stringify(send));
}

function drawMap(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.beginPath();
  context.setLineDash([10, 15]);
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.strokeStyle = "#ffffff44";
  context.lineWidth = 4;
  context.stroke();
  context.setLineDash([]);
  context.shadowBlur = 20;
  context.shadowColor = "pink";
}

function drawPlayer(context: CanvasRenderingContext2D, player: Player) {
  context.fillStyle = "white";
  context.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall(context: CanvasRenderingContext2D, ball: Ball) {
  const drawX = Math.round(ball.x + ball.size / 2);
  const drawY = Math.round(ball.y + ball.size / 2);

  context.beginPath();
  context.arc(drawX, drawY, ball.size / 2, 0, 2 * Math.PI);
  context.fillStyle = "white";
  context.fill();
  context.closePath();
}

function drawScore(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, player1: Player, player2: Player) {
  context.font = "32px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.globalAlpha = 1;

  context.fillText(player1.name, canvas.width / 4, 20);
  context.fillText(player2.name, canvas.width / 4 * 3, 20);

  context.font = "150px Arial";
  context.textBaseline = "middle";
  context.globalAlpha = 0.4;

  context.fillText(player1.score.toString(), canvas.width / 4, canvas.height / 2);
  context.fillText(player2.score.toString(), canvas.width / 4 * 3, canvas.height / 2);

  context.globalAlpha = 1;
}

function drawEndGame(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, player: string) {
  context.font = "80px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(player + " win", canvas.width / 2, canvas.height / 4);
}
