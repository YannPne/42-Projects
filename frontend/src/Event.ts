import { ws } from "./websocket.ts";
import type { ClientEvent, ResponseForEvent, ServerEvent } from "@ft_transcendence/core";

export function send(data: ClientEvent) {
  ws?.send(JSON.stringify(data));
}

export function sendAndWait<E extends ClientEvent>(data: E, timeout: number = 5_000) {
  if (ws == undefined)
    throw new Error("WebSocket not connected");

  send(data);

  return new Promise<ResponseForEvent<E>>((resolve, reject) => {
    const listener = (event: MessageEvent) => {
      const message: ServerEvent = JSON.parse(event.data);
      if (message.event == data.event) {
        ws?.removeEventListener("message", listener);
        resolve(message as ResponseForEvent<E>);
      }
    };

    ws?.addEventListener("message", listener);

    setTimeout(() => {
      ws?.removeEventListener("message", listener);
      reject("Timeout");
    }, timeout);
  });
}
