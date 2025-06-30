import { loadPage, type Page } from "./Page.ts";
import { pongPage } from "./pongPage.ts";
import { loginPage } from "./loginPage.ts";
import { send, sendAndWait } from "../Event.ts";
import type { ServerEvent } from "@ft_transcendence/core";
import { awaitWs, ws } from "../websocket.ts";
import { chatPage } from "./chatPage.ts";
import {startPage} from "./startPage.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;

export const chooseGamePage: Page = {
  url: "/choose_game",
  title: "Choose game",

  getPage() {
    return `
      <div class="h-full flex">
        <div class="flex-1 flex flex-col p-5 overflow-hidden h-full items-center">
          <p class="text-2xl font-bold mb-3">Available games</p>
          <ul id="games" class="flex-1 overflow-y-auto w-3/4 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></ul>
          <form class="mt-5 bg-gray-900" id="create-game">
            <input id="create-game-name" type="text" required placeholder="New game's name" class="p-2 placeholder-gray-400">
            <input type="checkbox" id="create-game-private" class="ml-2" />
            <label for="create-game-private" class="mr-2">Private</label>
            <button class="p-2 bg-blue-900 hover:bg-blue-950">Create a new game</button>
          </form>
        </div>
        ${chatPage.getPage()}
      </div>
    `;
  },

  async onMount() {
    if (ws == undefined) {
      loadPage(loginPage, this, "REPLACE");
      return;
    }

    await awaitWs();

    chatPage.onMount();

    const createGame = document.querySelector<HTMLFormElement>("#create-game")!;
    const createGameName = document.querySelector<HTMLInputElement>("#create-game-name")!;
    const games = document.querySelector<HTMLUListElement>("#games")!;

    const privateCheckbox = createGame.querySelector<HTMLInputElement>("#create-game-private")!;

    createGame.onsubmit = event => {
      event.preventDefault();
      send({
        event: "create_game",
        type: privateCheckbox.checked ? "PRIVATE_TOURNAMENT" : "PUBLIC_TOURNAMENT",
        name: createGameName.value
      });
      loadPage(startPage);
    };

    ws.addEventListener("message", wsListener = event => {
      const message: ServerEvent = JSON.parse(event.data);

      switch (message.event) {
        case "get_games":
          games.innerHTML = "";
          for (let game of message.games) {
            const li = document.createElement("li");
            li.textContent = game.name;
            li.className = "pl-9 pr-9 p-2.5 hover:bg-gray-500 cursor-pointer";
            li.onclick = async () => {
              const response = await sendAndWait({
                event: "join_game",
                uid: game.uid
              });
              if (response.success)
                loadPage(response.started ? pongPage : startPage);
              else
                alert("This game no longer exists");
            };
            games.appendChild(li);
          }
          break;
      }
    });
    send({ event: "get_games" });
  },

  onUnmount() {
    if (wsListener != undefined)
      ws?.removeEventListener("message", wsListener);
    wsListener = undefined;
    chatPage.onUnmount();
  },

  toJSON() {
    return this.url;
  }
};