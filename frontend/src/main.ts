import chooseGamePage from "./pages/chooseGame.ts";

export function loadPage(page: string) {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = page;
}

export const ws = new WebSocket("ws://" + document.location.hostname + ":3000/ws");
ws.onopen = _ => console.log("WebSocket connection opened");
ws.onclose = _ => console.log("WebSocket connection closed");
ws.onmessage = console.log;

loadPage(chooseGamePage());