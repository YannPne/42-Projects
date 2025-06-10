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

export type Tournament = {
  type: "tournament",
  rounds: {
    matches: {
      players?: {
        name: string,
        avatar?: number[],
        score: number
      }[]
    }[]
  }[];
};

export type Game = {
  type: "game",
  opponent: string,
  selfScore: number,
  opponentScore: number,
  date: number
};

export type Friend = {
  id: number,
  displayName: string,
  avatar?: number[],
  online: boolean
};

export type Message =
  | { type: "message", sender: number, content: string }
  | { type: "invite" | "announce", tournament: number, name: string };

export type ClientEvent =
  // GAME
  | { event: "get_games" }
  | { event: "join_game", uid: string, name?: string }
  | { event: "add_local_player", name: string, isAi: boolean }
  | { event: "play" }
  | { event: "leave_game" }
  | { event: "move", id: number, goUp?: boolean, goDown?: boolean }
  | { event: "get_tournament" }
  // PROFILE
  | { event: "get_profile", id?: number }
  | { event: "add_friend", name: string }
  | { event: "remove_friend", id: number }
  // SETTINGS
  | { event: "get_settings" }
  | { event: "update_info", username?: string, displayName?: string, password?: string, email?: string, avatar?: number[] }
  | { event: "setup_2fa", enable: boolean }
  | { event: "setup_2fa_check", code: string }
  | { event: "hide_profile", hide: boolean }
  | { event: "remove_account" }
  // CHAT
  | { event: "init_chat" }
  | { event: "message", to?: number, message: Message & { type: "message" } }
  | { event: "leave_chat" }
  ;

export type ServerEvent =
  // GENERAL
  | { event: "connected", displayName: string, avatar?: number[] }
  // GAME
  | { event: "get_games", games: { uid: string, name: string }[] }
  | { event: "update", players: Player[], ball: Ball }
  | { event: "win", player: string }
  | { event: "get_tournament", tournament: string[] }
  // PROFILE
  | { event: "get_profile", locked: true, displayName: string }
  | { event: "get_profile", locked: false, self: boolean, avatar?: number[], online: boolean, displayName: string, username: string, email: string, games: (Game | Tournament)[], friends: Friend[] }
  | { event: "add_friend", success: boolean }
  | { event: "remove_friend", success: boolean }
  // SETTINGS
  | { event: "get_settings", username: string, displayName: string, email: string, avatar?: number[], enabled2fa: boolean, hidden: boolean }
  | { event: "update_info", success: boolean }
  | { event: "setup_2fa", secret?: string, username?: string }
  | { event: "setup_2fa_check", success: boolean }
  | { event: "remove_account", success: boolean }
  // CHAT
  | { event: "init_chat", id: number, friends: number[], online: { id: number, name: string, avatar?: number[] }[] }
  | { event: "enter_chat", id: number, name: string, avatar?: number[] }
  | { event: "leave_chat", id: number }
  | { event: "message", from?: number, message: Message }
  ;

export type ServerResponseByEvent = {
  [E in ServerEvent as E["event"]]: E;
};

export type ResponseForEvent<E extends ClientEvent> =
  E["event"] extends keyof ServerResponseByEvent
    ? ServerResponseByEvent[E["event"]]
    : never;