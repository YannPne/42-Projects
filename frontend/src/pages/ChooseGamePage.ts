import { ws } from "../main.ts";
import { loadPage, type Page } from "./Page.ts";
import PongPage from "./PongPage.ts";

const ChooseGamePage: Page = {
  url: "/",
  title: "Choisit la partie",

  getPage(): string {
    return `
      <ul id="games"></ul>
      <button type="button" id="createGame">Creer une partie</button>
    `;
  },

  onMount() {
    document.querySelector<HTMLButtonElement>("#createGame")!.onclick = _ => {
      ws.send(JSON.stringify({
        event: "join_game",
        uid: crypto.randomUUID(),
        name: "Hello world"
      }));

      loadPage(PongPage);
    };
  },

  onUnmount() {
  }
};

export default ChooseGamePage;