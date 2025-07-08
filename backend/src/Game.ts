import Ball from "./Ball";
import { addTournamentMatches, getTotalTournaments, getTournamentMatches } from "./smartContract";
import Player from "./Player";
import User from "./User";
import { onlineUsers } from "./websocket/websocket";
import { sqlite } from "./index";
import { GameType, nextPow } from "@ft_transcendence/core";

export let games: Game[] = [];

export enum GameState {
  CREATING,
  IN_GAME,
  SHOW_WINNER,
  ABORTED,
}

export type Match =
  | { player1: Player, player2: Player, score1: number, score2: number }
  | { player1: Player, player2: null, score1: number }

// get the max-number of tournament already in the blockchain at launch
// use it for retrieve the good tournament (actual id + idTournament = actual pos in the blockchain)
export const idTournament = getTotalTournaments();

export class Game {
  static readonly WIN_SCORE = 5;
  static readonly WIDTH = 1200;
  static readonly HEIGHT = 600;

  readonly name?: string;
  readonly uid: string;
  readonly type: GameType;
  state: GameState = GameState.CREATING;
  readonly ball: Ball = new Ball(this);
  players: Player[] = [];
  users: User[] = [];
  tournament: Match[][] = [];
  currentMatch?: Match;

  constructor(type: GameType, name?: string) {
    this.name = name;
    this.uid = crypto.randomUUID();
    this.type = type;

    this.loop()
      .then(() => console.log("Game finished"))
      .catch(console.error);
  }

  addUser(user: User) {
    if (this.state == GameState.CREATING) {
      const player = new Player(this, user, user.displayName, false);
      this.players.push(player);
      user.players.push(player);
    }

    this.users.push(user);
    user.game = this;

    this.sendTournamentUpdate();
  }

  removeUser(user: User) {
    this.players = this.players.filter(p => !user.players.includes(p));
    this.users.splice(this.users.indexOf(user), 1);

    user.game = undefined;
    user.players = [];

    if (this.players.filter(p => !p.isAi).length == 0) {
      this.state = GameState.ABORTED;
    }

    this.sendTournamentUpdate();
  }

  /**
   * @param name The name of the local player
   * @param user Let undefined if it is an AI player
   */
  addLocalPlayer(name: string, user?: User) {
    if (this.state != GameState.CREATING)
      return;

    const player = new Player(this, user, name, user == undefined);
    this.players.push(player);
    user?.players.push(player);
    this.sendTournamentUpdate();
  }

  sendTournamentUpdate(user?: User) {
    if (this.type == "LOCAL")
      return;

    if (this.state == GameState.CREATING)
      this.generateTournamentRound();

    const players = this.players.map(p => ({
      id: p.id,
      displayName: p.name,
      avatar: !p.isDefaultOfUser ? null : p.user?.avatar?.toJSON().data
    }));
    const matches: { player: string | null, score: number, running: boolean }[][] = [];

    for (let i = 0; i < this.tournament.length; i++) {
      matches.push([]);
      for (let match of this.tournament[i]) {
        const running = match === this.currentMatch;
        matches[i].push({ player: match.player1.id, score: match.score1, running });
        if (match.player2 != null)
          matches[i].push({ player: match.player2.id, score: match.score2, running });
        else
          matches[i].push({ player: null, score: 0, running });
      }
    }

    if (user != undefined)
      user.send({ event: "tournament", players, matches });
    else {
      for (let user of this.users)
        user.send({ event: "tournament", players, matches });
    }

    if (this.state == GameState.CREATING)
      this.tournament = [];
  }

  resetPos(match: Match & { player2: Player }) {
    this.ball.resetPos(match);
    const { player1, player2 } = match;
    player1.x = 30;
    player1.y = (Game.HEIGHT - Player.HEIGHT) / 2;
    player2.x = Game.WIDTH - Player.WIDTH - 30;
    player2.y = (Game.HEIGHT - Player.HEIGHT) / 2;
  }

  checkWin(match: Match & { player2: Player }) {
    if (this.ball.left < 0)
      match.score2++;
    else if (this.ball.right > Game.WIDTH)
      match.score1++;
    else
      return;

    this.resetPos(match);
    this.sendTournamentUpdate();
  }

  generateTournamentRound() {
    const current: Match[] = [];

    if (this.tournament.length == 0) {
      const bye = this.players.length < 2
        ? 0
        : nextPow(this.players.length) - this.players.length;

      for (let i = 0; i < this.players.length - bye; i += 2) {
        current.push({
          player1: this.players[i],
          player2: this.players[i + 1] ?? null,
          score1: 0,
          score2: 0
        });
      }

      for (let i = this.players.length - bye; i < this.players.length; i++) {
        current.push({
          player1: this.players[i],
          player2: null,
          score1: 0
        });
      }
    } else {
      const lastRound = this.tournament[this.tournament.length - 1];

      for (let i = 0; i < lastRound.length; i += 2) {
        let match = lastRound[i];
        const player1 = match.player2 == null || match.score1 > match.score2 ? match.player1 : match.player2;
        match = lastRound[i + 1];
        const player2 = match == undefined ? null
          : match.player2 == null || match.score1 > match.score2 ? match.player1 : match.player2;

        current.push({ player1, player2, score1: 0, score2: 0 });
      }
    }

    this.tournament.push(current);
  }

  async loop() {
    while (this.state == GameState.CREATING)
      await new Promise(resolve => setTimeout(resolve, 50));

    a: do {
      this.generateTournamentRound();
      const matches = this.tournament[this.tournament.length - 1];

      for (let match of matches) {
        if (match.player2 == null)
          continue;

        this.currentMatch = match;
        const { player1, player2 } = match;
        this.resetPos(match);

        for (let user of this.users) {
          user.send({
            event: "next_match",
            players: [ player1.name, player2.name ]
          });
        }
        this.sendTournamentUpdate();
        await new Promise((res) => setTimeout(res, 5_000));

        while (Math.max(match.score1, match.score2 ?? -1) < Game.WIN_SCORE) {
          if (this.state != GameState.IN_GAME)
            break a;

          const startTime = Date.now();

          this.ball.move();
          player1.move();
          player2.move();
          this.ball.updateSpeed(player1, player2);
          this.checkWin(match);

          for (let user of this.users) {
            user.send({
              event: "update",
              ball: this.ball.toJSON(),
              players: [ { ...player1.toJSON(), score: match.score1 }, { ...player2.toJSON(), score: match.score2 } ]
            });
          }

          await new Promise((res) =>
            setTimeout(res, 10 - (Date.now() - startTime)));
        }

        sqlite.prepare(`INSERT INTO games (player1_id, player1_name, player1_score, player2_id, player2_name, player2_score)
            VALUES (?, ?, ?, ?, ?, ?)`)
          .run(player1.isDefaultOfUser ? player1.user?.id : null,
            player1.isDefaultOfUser ? null : player1.name,
            match.score1,
            player2.isDefaultOfUser ? player2.user?.id : null,
            player2.isDefaultOfUser ? null : player2.name,
            match.score2);
      }
    } while (this.tournament[this.tournament.length - 1].length >= 2);

    if (this.state == GameState.IN_GAME) {
      this.state = GameState.SHOW_WINNER;
      const match = this.tournament[this.tournament.length - 1][0];
      for (let user of this.users) {
        user.send({
          event: "win",
          player: (match.player2 == null || match.score1 > match.score2 ? match.player1 : match.player2).name
        });
        user.game = undefined;
        user.players = [];
      }
    }

    this.currentMatch = undefined;
    games.splice(games.indexOf(this), 1);
    for (let user of onlineUsers)
      user.send({ event: "get_games", games: games.map(g => g.toJSON()) });

    if (this.type != "LOCAL")
      await this.saveToBlockchain();
  }

  toJSON() {
    return {
      uid: this.uid,
      name: this.name!
    };
  }

  async saveToBlockchain() {
    const matchIds: number[] = [];
    const matchScores: number[][] = [];

    let i = 0;
    for (let round of this.tournament) {
      for (let match of round) {
        matchIds.push(i++);
        matchScores.push([ match.score1, match.player2 == null ? Number.MAX_SAFE_INTEGER : match.score2 ]);
      }
    }

    try {
      await addTournamentMatches(matchIds, matchScores);
      console.log("Blockchain transaction send with success !");
    } catch (err) {
      console.error("Error when the match is send to the smart contract :", err);
    }
  }

  async getTournament() {
    const tournamentId = await idTournament; // + id actual in your database

    try {
      await getTournamentMatches(tournamentId);
      console.log("Blockchain get transaction send with success !");
    } catch (err) {
      console.error("Error when the match is retrieve from the smart contract :", err);
    }
  }
}
