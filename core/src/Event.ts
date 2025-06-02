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
}

export type ClientEvent =
  | { event: "get_games" }
  | { event: "join_game", uid: string, name?: string }
  | { event: "add_local_player", name: string, isAi: boolean }
  | { event: "play" }
  | { event: "leave_game" }
  | { event: "move", id: number, goUp?: boolean, goDown?: boolean }
  | { event: "update_info", username?: string, displayName?: string, password?: string, email?: string, avatar?: number[] | null }
  | { event: "add_friend", name: string }
  | { event: "del_account" }
  | { event: "remove_friend", id: number }
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
  | { event: "add_friend", success: boolean }
  | { event: "del_account", success: boolean }
  | { event: "remove_friend", success: boolean }
  | { event: "get_tournament", tournament: string[] }
  | { event: "2fa", enable?: boolean, secret?: string, username?: string }
  | { event: "2fa_check", success: boolean }
  | { event: "invite_player", gameId: string, gameName: string, sender: string, senderId: number }
  | { event: "broadcast_message", content: string, sender: string, senderId: number, isBlocked: boolean, isDm: boolean }
  | { event: "swap_blocked", success: boolean }
  | { event: "get_dm_info", isBlocked: boolean, id: number, isMe: boolean, exists: boolean }
  | { event: "get_profile", locked: true, displayName: string }
  | { event: "get_profile", locked: false, avatar?: number[], online: boolean, displayName: string, username: string, email: string, games: (Game | Tournament)[], friends: Friend[] };

export type ServerResponseByEvent = {
  [E in ServerEvent as E["event"]]: E;
};

export type ResponseForEvent<E extends ClientEvent> =
  E["event"] extends keyof ServerResponseByEvent
    ? ServerResponseByEvent[E["event"]]
    : never;