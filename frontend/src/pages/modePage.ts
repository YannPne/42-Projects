import { ws } from "../websocket.ts";
import { loadPage, type Page } from "./Page.ts";
import { pongPage } from "./pongPage.ts";
import { loginPage } from "./loginPage.ts";
import { chatPage } from "./chatPage.ts";
import { chooseGamePage } from "./chooseGamePage.ts";
import { send } from "../Event.ts";

let wsListener: ((event: MessageEvent) => void) | undefined;

export const modePage: Page = {
  url: "/mode",
  title: "Game mode",

  getPage(): string {
    return `
		  <div class="h-full flex">
		    <div class="flex-1 flex flex-col items-center justify-center">
          <div class="space-y-5 *:w-full *:px-12 *:py-4 *:bg-gray-700 *:text-white *:rounded *:hover:bg-gray-600 *:cursor-pointer">
            <button id="btn-training">Training</button>
            <button id="btn-tournament">Tournament</button>
          </div>
        </div>
				${chatPage.getPage()}
			</div>
	  `;
  },

  async onMount() {
    if (ws == undefined) {
      loadPage(loginPage, modePage, "REPLACE");
      return;
    }

    chatPage.onMount();

    document.querySelector<HTMLButtonElement>('#btn-training')!.onclick = () => {
      send({
        event: "create_game",
        type: "LOCAL"
      });
      loadPage(pongPage);
    };

    document.querySelector<HTMLButtonElement>('#btn-tournament')!.onclick = () =>
      loadPage(chooseGamePage);
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