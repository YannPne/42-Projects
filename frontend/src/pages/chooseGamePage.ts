import { loadPage, type Page } from "./Page.ts";
import { pongPage } from "./pongPage.ts";
import { loginPage } from "./loginPage.ts";
import { send, sendAndWait } from "../Event.ts";
import type { ServerEvent } from "@ft_transcendence/core";
import { awaitWs, ws } from "../websocket.ts";
import { chatData, chatPage } from "./chatPage.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;

export const chooseGamePage: Page = {
  url: "/choose_game",
  title: "Choose game",

  getPage() {
    return `
      
      <div class="h-full flex flex-col overflow-hidden">
   
        <hr class="h-px bg-gray-200 border-0">
        <div class="flex-1 flex">
          <div class="flex-1 flex flex-col p-5 overflow-hidden">
            
            <div class="flex flex-col h-full items-center p-5">
              <p class="text-2xl font-bold mb-3">Available games</p>
              <ul id="games" class="flex-1 overflow-y-auto w-3/4 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></ul>
              <form class="mt-5 bg-gray-900" id="createGame">
                <input id="createGameName" type="text" required placeholder="New game's name" class="p-2 placeholder-gray-400">
                <button class="p-2 bg-blue-900 hover:bg-blue-950">Create a new game</button>
                <label class="inline-flex items-center ml-2 text-gray-300 pr-4">
                  <input type="checkbox" id="createGamePrivate" class="form-checkbox" />
                  <span class="ml-2">Private</span>
                </label>
              </form>
            </div>

          </div>
          <div id="divider" class="h-full w-[6px] bg-gray-600 cursor-pointer"></div>
				  <div id="liveChat" class="w-[30%] flex flex-col px-5 pt-5">
            ${chatPage.getPage()}
          </div>
        </div>
      </div>
    `;
  },

  async onMount() {
    if (ws == undefined) {
      loadPage(loginPage, this, "REPLACE");
      return;
    }

    const divider = document.getElementById("divider")!;
    const liveChat = document.getElementById("liveChat")!;

	  chatPage.onMount();

	  if (chatData.hidden)
		  liveChat.classList.add("hidden");
	  divider.addEventListener("click", () => chatData.hidden = liveChat.classList.toggle("hidden"));

    await awaitWs();

    const createGame = document.querySelector<HTMLFormElement>("#createGame")!;
    const createGameName = document.querySelector<HTMLInputElement>("#createGameName")!;
    const games = document.querySelector<HTMLUListElement>("#games")!;

    const privateCheckbox = createGame.querySelector<HTMLInputElement>("#createGamePrivate")!;

    createGame.onsubmit = event => {
      event.preventDefault();
      send({
        event: "create_game",
        type: privateCheckbox.checked ? "PRIVATE_TOURNAMENT" : "PUBLIC_TOURNAMENT",
        name: createGameName.value
      });
      loadPage(pongPage);
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
                loadPage(pongPage);
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