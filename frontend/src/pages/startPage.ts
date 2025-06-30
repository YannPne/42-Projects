import {loadPage, type Page} from "./Page.ts";
import {modePage} from "./modePage.ts";
import {ws} from "../websocket.ts";
import {sendAndWait} from "../Event.ts";
import {chatPage} from "./chatPage.ts";

export const startPage: Page = {
  url: "/start",
  title: "Starting game...",

  getPage() {
    return `
      <div class="h-full flex">
        <div class="flex-1">
          <button id="start">Start</button>
        </div>
        ${chatPage.getPage()}
      </div>
    `;
  },

  async onMount() {
    if (ws == undefined) {
      loadPage(modePage, undefined, "REPLACE");
      return;
    }

    const currentGame = await sendAndWait({ event: "get_current_game"});
    if (currentGame.id == undefined) {
      loadPage(modePage, undefined, "REPLACE");
      return;
    }

    chatPage.onMount();
  },

  onUnmount() {
    chatPage.onUnmount();
  },

  toJSON() {
    return this.url;
  }
};