import { ws } from "../main.ts";
import { loadPage, type Page } from "./Page.ts";
import { pongPage } from "./pongPage.ts";
import { sendAndWait } from "../Event.ts";

export const chooseGamePage: Page = {
  url: "/choose_game",
  title: "Choisir la partie",

  getPage(): string {
    return `
      <ul id="games"></ul>
      <button type="button" id="createGame">Creer une partie</button>
    `;
  },

  onMount() {
    document.querySelector<HTMLButtonElement>("#createGame")!.onclick = () => {
      ws.send(JSON.stringify({
        event: "join_game",
        uid: crypto.randomUUID(),
        name: "Hello world"
      }));

      loadPage(pongPage);
    };

    const games = document.querySelector<HTMLUListElement>("#games")!;
    sendAndWait({ event: "get_games" }).then(message => {
      console.log(message);
      for (let game of message.games!) {
        const button = document.createElement("button");
        button.innerHTML = game.name;
        button.onclick = () => {
          ws.send(JSON.stringify({
            event: "join_game",
            uid: game.uid
          }));

          loadPage(pongPage);
        };
        games.appendChild(button);
      }
    });
  },

  onUnmount() {
  }
};
