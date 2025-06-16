import { loadPage, type Page } from "./Page.ts";
import { ws } from "../websocket.ts";
import { modGamePage } from "./modGamePage.ts";

export const homePage: Page = {
  url: "/",
  title: "Home",

  getPage() {
    return `
      <div class="h-full flex flex-col justify-center items-center">
        <p class="text-5xl pb-5 font-bold">ft_transcendence</p>
        <div>
          <p class="text-3xl pb-5">The art of transcending the reality</p>
          <p class="text-xl pb-10">A revolutionizing Pong game</p>
          <div>
            <p>Rules:</p>
            <ul class="pl-3">
              <li>2 players &bullet; 2 camps &bullet; 2 paddles &bullet; 1 ball</li>
              <li>Objectives: Hit the ball past the opponent's paddle to score points</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },

  onMount() {
    if (ws != undefined) {
      loadPage(modGamePage, undefined, "REPLACE");
      return;
    }
  },

  onUnmount() {
  },

  toJSON() {
    return this.url;
  }
};
