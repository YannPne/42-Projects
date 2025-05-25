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
  | { event: "leave_game"}
  | { event: "move", id: number, goUp?: boolean, goDown?: boolean }
  | { event: "update", ball: Ball, players: Player[] }
  | { event: "win", player: string }
  | { event: "update_info", username?: string, displayName?: string, password?: string, email?: string, avatar?: number[] | null, success?: boolean}
  | { event: "set_friend", name: string, success?: boolean }
  | { event: "del_account", success?: boolean}
  | { event: "get_games_history", name1?: string, games?: {score1: number, score2: number, name2: string, date: string}[] }
  | { event: "get_info_profile", name?: string, profileUsername?: string, mainProfile?: boolean, displayName?: string, avatar?: { type: "Buffer", data: number[] } | null, email?: string, friends?: string[], status?: boolean, hideProfile?: boolean}
  | { event: "remove_friend", name?: string, success?: boolean }
  | { event: "get_status", friends?: string[], status?: boolean[] }
  | { event: "set_hide_profile", hide?: boolean}
  | { event: "2fa", enable?: boolean, secret?: string, username?: string }
  | { event: "2fa_check", code?: string, success?: boolean }
  | { event: "invite_player", gameID?: any, userToInvite?: string, sender?: string}
  | { event: "broadcast_message", content: string}
  | { event: "swap_blocked", id: number, success?: boolean}
  | { event: "getInfoDm", other_user: string, blocked?: boolean, id?: any, is_me?: boolean, is_exist?: boolean}

export function sendAndWait<T extends Event>(data: T, timeout: number = 5_000) {
  if (ws == undefined)
    throw new Error("WebSocket not connected");

  ws.send(JSON.stringify(data));

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