import { ws } from "./main.ts";

export type Player = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
};

export type Ball = {
  x: number;
  y: number;
  size: number;
};

export type Event =
  | { event: "get_games", games?: { uid: string, name: string }[] }
  | { event: "join_game", uid: string, name?: string }
  | { event: "play" }
  | { event: "move", id: number, goUp?: boolean, goDown?: boolean }
  | { event: "update", ball: Ball, players: Player[] }
  | { event: "win", player: string }

export function sendAndWait<T extends Event>(data: T, timeout: number = 5_000) {
  ws?.send(JSON.stringify(data));

  return new Promise<Event & T>((resolve, reject) => {
    const listener = (event: MessageEvent) => {
      const message: T = JSON.parse(event.data);
      if (message.event == data.event) {
        ws?.removeEventListener("message", listener);
        resolve(message);
      }
    };

    ws?.addEventListener("message", listener);

    setTimeout(() => {
      ws?.removeEventListener("message", listener);
      reject("Timeout");
    }, timeout);
  });
}