import Ball from "./Ball";
import { addTournamentMatches, getTotalTournaments, getTournamentMatches } from "./smartContract";
import Player from "./Player";
import User from "./User";
import { onlineUsers } from "./websocket/websocket";
import { sqlite } from "./index";
import { GameType } from "@ft_transcendence/core";

export let games: Game[] = [];

export enum GameState {
  CREATING,
  IN_GAME,
  SHOW_WINNER,
  ABORTED,
}

// get the max-number of tournament already in the blockchain at launch
// use it for retrieve the good tournament (actual id + idTournament = actual pos in the blockchain)
export const idTournament = getTotalTournaments();

export class Game {
  readonly winScore: number = 5;
  readonly width: number = 1200;
  readonly height: number = 600;

  readonly name?: string;
  readonly uid: string;
  readonly type: GameType;
  state: GameState = GameState.CREATING;
  ball: Ball = new Ball(this);
  players: Player[] = [];
  users: User[] = [];
  tournament: {
    player1: Player;
    player2: Player | null;
    score1: number;
    score2: number | null;
  }[][] = [];
  tournamentRound = 0;
  tournamentRoundMatch = 0;

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
      const player = new Player(this, user.displayName, false);
      this.players.push(player);
      user.players.push(player);
    }

    this.users.push(user);
    user.game = this;

    this.updateTournament();
  }

  removeUser(user: User) {
    this.players = this.players.filter(p => !user.players.includes(p));
    this.users.splice(this.users.indexOf(user), 1);

    user.game = undefined;
    user.players = [];

    if (this.players.filter(p => !p.isAi).length == 0) {
      this.state = GameState.ABORTED;
      games.splice(games.indexOf(this), 1);
    }

    this.updateTournament();
  }

  /**
   * @param name The name of the local player
   * @param user Let undefined if it is an AI player
   */
  addLocalPlayer(name: string, user?: User) {
    if (this.state != GameState.CREATING)
      return;

    const player = new Player(this, name, user == undefined);
    this.players.push(player);
    user?.players.push(player);
    this.updateTournament();
  }

  updateTournament() {
    const players = this.players.map(p => ({
      id: p.id,
      displayName: p.name,
      avatar: p.isAi ? null : undefined // TODO: With damien's PR, p will contain the user, use this instead.
    }));
    const matches: { player: string, score: number }[][] = [];

    for (let i = 0; i < this.tournament.length; i++) {
      matches.push([]);
      for (let tournament of this.tournament[i]) {
        matches[i].push({ player: tournament.player1.id, score: tournament.score1 });
        matches[i].push({ player: tournament.player2.id, score: tournament.score2 });
      }
    }

    for (let user of this.users)
      user.send({ event: "tournament", players, matches });
  }

  resetPos() {
    this.ball.resetPos();
    const [ player1, player2 ] = this.players;
    player1.x = 30;
    player1.y = (this.height - player1.height) / 2;
    player2.x = this.width - player2.width - 30;
    player2.y = (this.height - player2.height) / 2;
  }

  checkWin() {
    let player: Player;

    if (this.ball.left < 0) player = this.players[1];
    else if (this.ball.right > this.width) player = this.players[0];
    else return false;

    player.score++;
    if (player.score >= this.winScore) {
      const [ player1, player2 ] = this.players.splice(0, 2);
      this.tournament[this.tournament.length - 1].push({
        player1,
        player2,
        score1: player1.score,
        score2: player2.score
      });
      this.players.push(player);

      let date = new Date();
      const convertDate = date.toISOString().split("T")[0];
      sqlite.prepare(`INSERT INTO games (name1, name2, score1, score2, date)
        VALUES (?, ?, ?, ?, ?)`)
        .run(player1.name, player2.name, player1.score, player2.score, convertDate);
    }

    if (this.players.length == 1) {
      this.state = GameState.SHOW_WINNER;
      return true;
    }

    this.resetPos();
    return true;
  }

  generateTournamentRound() {
    const current: {
      player1: Player;
      player2: Player | null;
      score1: number;
      score2: number | null;
    }[] = [];

    if (this.tournament.length == 1) {
      for (let i = 0; i < this.players.length; i += 2) {
        const first = this.players[i];
        const second = this.players[i + 1];

        current.push({
          player1: first,
          player2: second ?? null,
          score1: first.score,
          score2: second?.score ?? null
        });
      }
    } else {
      const last = this.tournament[this.tournament.length - 1];

      for (let i = 0; i < last.length; i += 2) {
        let tempLast = last[i];
        const first = tempLast.score1 > (tempLast.score2 ?? -1) ? tempLast.player1 : tempLast.player2!;
        tempLast = last[i + 1];
        // must check tempLast not undefined
        const second = this.players[i + 1];
      }
    }

    this.tournament.push(current);
  }

  async loop() {
    while (this.state == GameState.CREATING)
      await new Promise((resolve) => setTimeout(resolve, 50));

    let [ player1, player2 ] = this.players;
    this.resetPos();

    while (this.state == GameState.IN_GAME) {
      const startTime = Date.now();

      this.ball.move();
      player1.move();
      player2.move();
      this.ball.updateSpeed(player1, player2);

      if (this.checkWin()) {
        // @ts-ignore
        if (this.state == GameState.SHOW_WINNER) break;
        [ player1, player2 ] = this.players;
        // for (const u of this.users) 
        //   u.socket.send(JSON.stringify({ event: "get_tournament", tournament: this.players.map(u => u.name) }));
      }

      for (let user of this.users) {
        user.send({
          event: "update",
          ball: this.ball,
          players: [ player1, player2 ]
        });
        // for (const u of this.users) 
        //   u.socket.send(JSON.stringify({ event: "get_tournament", tournament: this.players.map(u => u.name) }));
      }

      await new Promise((res) =>
        setTimeout(res, 10 - (Date.now() - startTime)));
    }

    for (let user of this.users) {
      user.send({
        event: "win",
        player: this.players[0].name
      });
      user.game = undefined;
      user.players = [];
    }

    games.splice(games.indexOf(this), 1);
    for (let user of onlineUsers)
      user.send({ event: "get_games", games: games.map(g => g.toJSON()) });

    /*blockchain*/
    await this.saveTournament();
    await this.getTournament();
  }

  toJSON() {
    return {
      uid: this.uid,
      name: this.name!
    };
  }

  /*blockchain function*/
  async saveTournament() {
    const matchIds: number[] = [];
    const matchScores: number[][] = [];

    for (let i = 0; i < this.tournament.length; i++) {
      const match = this.tournament[i];
      matchIds.push(i);
      matchScores.push([ match.score1, match.score2 ]);
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
