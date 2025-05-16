import "./pages/Page.ts"

export let ws: WebSocket | undefined;

export function connectWs()
{
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