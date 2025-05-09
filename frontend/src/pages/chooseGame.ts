import { loadPage, ws } from "../main.ts";
import pongPage from "./pong.ts";

export default function chooseGamePage() {
  return `
    <ul id="games"></ul>
    <button type="button" id="createGame">Creer une partie</button>
  `;
}

document.querySelector<HTMLButtonElement>("#createGame")!.onclick = _ => {
  ws.send(JSON.stringify({
    event: "join_game",
    uid: crypto.randomUUID(),
    name: "Hello world"
  }));

  loadPage(pongPage());
};