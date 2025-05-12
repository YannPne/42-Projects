import "./pages/Page.ts"

export const ws = new WebSocket("ws://" + document.location.hostname + ":3000/ws");
ws.onopen = _ => console.log("WebSocket connection opened");
ws.onclose = _ => console.log("WebSocket connection closed");
