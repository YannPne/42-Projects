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

export type Game = {};

export type Friend = {
  id: number,
  displayName: string,
  avatar?: number[]
}

export type ClientEvent =
  | { event: "get_games" }
  | { event: "join_game", uid: string, name?: string }
  | { event: "add_local_player", name: string, isAi: boolean }
  | { event: "play" }
  | { event: "leave_game" }
  | { event: "move", id: number, goUp?: boolean, goDown?: boolean }
  | { event: "update_info", username?: string, displayName?: string, password?: string, email?: string, avatar?: number[] | null }
  | { event: "set_friend", name: string }
  | { event: "del_account" }
  | { event: "get_games_history" }
  | { event: "get_info_profile" }
  | { event: "remove_friend", id: number }
  | { event: "get_status", friends: string[] }
  | { event: "get_tournament" }
  | { event: "set_hide_profile", hide: boolean }
  | { event: "2fa", enable?: boolean }
  | { event: "2fa_check", code: string }
  | { event: "invite_player", gameId: string, gameName: string, userToInvite: string }
  | { event: "broadcast_message", content: string }
  | { event: "swap_blocked", id: number }
  | { event: "get_dm_info", otherUser: string }
  | { event: "get_profile", id?: number };

export type ServerEvent =
  | { event: "get_games", games: { uid: string, name: string }[] }
  | { event: "update", players: Player[], ball: Ball }
  | { event: "win", player: string }
  | { event: "update_info", success: boolean }
  | { event: "set_friend", success: boolean }
  | { event: "del_account", success: boolean }
  | { event: "get_games_history", name1: string, games: { score1: number, score2: number, name2: string, date: string }[] }
  | { event: "get_info_profile", name: string, profileUsername: string, mainProfile: boolean, displayName: string, avatar: { type: "Buffer", data: number[] } | null, email: string, friends: string[], status: boolean, hideProfile: boolean }
  | { event: "remove_friend", success: boolean }
  | { event: "get_status", status: boolean[] }
  | { event: "get_tournament", tournament: string[] }
  | { event: "2fa", enable?: boolean, secret?: string, username?: string }
  | { event: "2fa_check", success: boolean }
  | { event: "invite_player", gameId: string, sender: string, senderId: number }
  | { event: "broadcast_message", content: string, sender: string, senderId: number, isBlocked: boolean, isDm: boolean }
  | { event: "swap_blocked", success: boolean }
  | { event: "get_dm_info", isBlocked: boolean, id: number, isMe: boolean, exists: boolean }
  | { event: "get_profile", locked: true }
  | { event: "get_profile", locked: false, avatar?: number[], displayName: string, username: string, email: string, gameHistory: Game[], friends: Friend[] };

type ServerResponseByEvent = {
  [E in ServerEvent as E["event"]]: E;
};

type ResponseForEvent<E extends ClientEvent> =
  E["event"] extends keyof ServerResponseByEvent
    ? ServerResponseByEvent[E["event"]]
    : never;

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

export function send(data: ClientEvent) {
  ws?.send(JSON.stringify(data));
}