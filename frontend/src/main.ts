import { findPage, loadPage, pages } from "./pages/Page.ts";
import { privacyPage } from "./pages/privacyPage.ts";

export let ws: WebSocket | undefined;

export function connectWs()  {
  return new Promise((resolve, reject) => {

    ws = new WebSocket("ws://" + document.location.hostname + ":3000/ws");
    ws.onopen = _ => console.log("WebSocket connection opened");
    ws.onclose = _ => console.log("WebSocket connection closed");

    ws.addEventListener("open", () => {
      resolve(undefined);
    }, {once: true});
    setTimeout(() => reject("Timeout"), 8_000);
  });
}

export function awaitWs(timeout: number = 5_000) {
  return new Promise((resolve, reject) => {
    if (ws!.readyState == ws!.OPEN)
      resolve(undefined);
    else if (ws!.readyState == ws!.CONNECTING) {
      ws!.addEventListener("open", () => {
        resolve(undefined);
      }, {once: true});

      setTimeout(() => reject("Timeout"), timeout);
    } else
      reject("WebSocket closing or closed");

  });
}

export function closeWs() {
  if (ws && ws.readyState == ws.OPEN)
    ws.close();
  ws = undefined;
}

const privacyLink = document.querySelector("#footer-privacy");

if (privacyLink) {
  privacyLink.addEventListener("click", async event => {
    event.preventDefault();
    loadPage(privacyPage);
  });
}

const nav = document.querySelector<HTMLElement>("nav")!;

for (let page of pages) {
  if (page.navbar === false)
    continue;
  const button = document.createElement("a");
  button.className = "flex-1 text-center p-3 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 transition-all hover:via-gray-950";
  button.innerHTML = typeof page.navbar == "string" ? page.navbar : page.title;
  button.href = page.url;
  button.onclick = async event => {
    event.preventDefault();
    if (ws != undefined && page.title == "Profile")
      await ws!.send(JSON.stringify({ event: "set_profile", name: null }));
    loadPage(page);
  };

  nav.appendChild(button);
}

loadPage(findPage(window.location.pathname));
