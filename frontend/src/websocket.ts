import { loadPage } from "./pages/Page.ts";
import { homePage } from "./pages/homePage.ts";
import { loggedNav, loggedNavProfile, unloggedNav } from "./main.ts";
import type { ServerEvent } from "@ft_transcendence/core";

export let ws: WebSocket | undefined;

export function connectWs() {
  return new Promise((resolve, reject) => {
    if (ws)
      ws.close();

    ws = new WebSocket("wss://" + document.location.host + "/api/ws?token=" + sessionStorage.getItem("token"));
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      loggedNav.style.display = "";
      unloggedNav.style.display = "none";
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      ws = undefined;
      sessionStorage.removeItem("token");
      loggedNav.style.display = "none";
      unloggedNav.style.display = "";
      loadPage(homePage);
    };
    ws.onerror = () => {
      sessionStorage.removeItem("token");
      ws = undefined;
      loggedNav.style.display = "none";
      unloggedNav.style.display = "";
      reject("Connection failed");
    };

    ws.addEventListener("message", event => {
      const message: ServerEvent = JSON.parse(event.data);
      if (message.event == "connected") {
        loggedNavProfile.querySelector("p")!.innerText = message.displayName;
        loggedNavProfile.querySelector("img")!.src = message.avatar
          ? URL.createObjectURL(new Blob([new Uint8Array(message.avatar)]))
          : "/avatar.webp";
      }
    });

    ws.addEventListener("open", () => {
      resolve(undefined);
    }, { once: true });
    setTimeout(() => reject("Timeout"), 5_000);
  });
}

export function awaitWs(timeout: number = 5_000) {
  return new Promise((resolve, reject) => {
    if (ws!.readyState == ws!.OPEN)
      resolve(undefined);
    else if (ws!.readyState == ws!.CONNECTING) {
      ws!.addEventListener("open", () => {
        resolve(undefined);
      }, { once: true });

      setTimeout(() => reject("Timeout"), timeout);
    } else
      reject("WebSocket closing or closed");

  });
}

export function closeWs() {
  if (ws && ws.readyState == ws.OPEN)
    ws.close();
  ws = undefined;
  sessionStorage.removeItem("token");
}