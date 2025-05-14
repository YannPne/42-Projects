import { awaitWs, ws } from "../main.ts";
import { loadPage, type Page } from "./Page.ts";
import { pongPage } from "./pongPage.ts";
import type { Event } from "../Event.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;

export const chooseGamePage: Page = {
  url: "/choose_game",
  title: "Choose game",
  navbar: "Pong Game",

  getPage(): string {
    return `
      <div class="flex flex-col h-full items-center p-5">
        <p class="text-2xl font-bold mb-3">Available games</p>
        <ul id="games" class="flex-1 overflow-y-auto w-3/4 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></ul>
        <form class="mt-5 bg-gray-900">
          <input id="createGameName" type="text" required placeholder="New game's name" class="p-2 placeholder-gray-400">
          <button type="button" id="createGame" class="p-2 bg-blue-900 hover:bg-blue-950">Create a new game</button>
        </form>
      </div>
    `;
  },

  async onMount() {
    await awaitWs();

    const createGameName = document.querySelector<HTMLInputElement>("#createGameName")!;
    document.querySelector<HTMLButtonElement>("#createGame")!.onclick = () => {
      if (createGameName.value.trim() == "")
        return;

      loadPage(pongPage, {
        event: "join_game",
        uid: crypto.randomUUID(),
        name: createGameName.value.trim()
      });
    };

    const games = document.querySelector<HTMLUListElement>("#games")!;
    ws.send(JSON.stringify({ event: "get_games" }));
    ws.addEventListener("message", wsListener = event => {
      const message: Event = JSON.parse(event.data);

      switch (message.event) {
        case "get_games":
          games.innerHTML = "";
          for (let game of message.games!) {
            const li = document.createElement("li");
            li.textContent = game.name;
            li.className = "pl-9 pr-9 p-2.5 hover:bg-gray-500 cursor-pointer";
            li.onclick = () => {
              loadPage(pongPage, {
                event: "join_game",
                uid: game.uid
              });
            };
            games.appendChild(li);
          }
          break;
      }
    });
  },

  onUnmount() {
    if (wsListener != undefined)
      ws.removeEventListener("message", wsListener);
    wsListener = undefined;
  }
};
