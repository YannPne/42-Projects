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
    | { event: "join_game", uid: string, name?: string }
    | { event: "play" }
    | { event: "move", id: number, goUp?: boolean, goDown?: boolean }
    | { event: "update", ball: Ball, players: Player[] }
    | { event: "win", player: string }