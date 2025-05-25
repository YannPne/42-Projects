import Ball from "./Ball";
import { addTournamentMatches, getTotalTournaments, getTournamentMatches } from "./smartContract";
import Player from "./Player";
import User from "./User";
import {insertGameHistory, onlineUsers} from "./websocket";

export let games: Game[] = [];
export enum GameState {
  CREATING,
  IN_GAME,
  SHOW_WINNER,
  ABORTED,
}

// get the max-number of tournement already in the blockchain at launch
// use it for retrieve the good tournement (actual id + idtournament = actual pos in the blockchain)
export const idtournament = getTotalTournaments();

export class Game {
  readonly winScore: number = 2;
  readonly width: number = 1200;
  readonly height: number = 600;

  readonly name: string;
  readonly uid: string;
  state: GameState = GameState.CREATING;
  ball: Ball = new Ball(this);
  players: Player[] = [];
  users: User[] = [];
  tournament: {
    player1: Player;
    player2: Player;
    score1: number;
    score2: number;
  }[] = [];

  constructor(name: string, uid: string) {
    this.name = name;
    this.uid = uid;

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
  }

  /**
   * @param name The name of the local player
   * @param user Let undefined if it is an AI player
   */
  addLocalPlayer(name: string, user?: User) {
    if (this.state != GameState.CREATING) return;

    const player = new Player(this, name, user == undefined);
    this.players.push(player);
    user?.players.push(player);
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
      this.tournament.push({
        player1,
        player2,
        score1: player1.score,
        score2: player2.score
      });
      this.players.push(player);

      let date = new Date();
      const convertDate = date.toISOString().split("T")[0];
      insertGameHistory({
        name1: player1.name,
        name2: player2.name,
        score1: player1.score,
        score2: player2.score,
        date: convertDate
      });
    }

    if (this.players.length == 1) {
      this.state = GameState.SHOW_WINNER;
      return true;
    }

    this.resetPos();
    return true;
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
      }

      for (let user of this.users) {
        user.socket.send(JSON.stringify({
          event: "update",
          ball: this.ball,
          players: [ player1, player2 ]
        }));
      }

      await new Promise((res) =>
          setTimeout(res, 10 - (Date.now() - startTime)));
    }

    for (let user of this.users) {
      user.socket.send(JSON.stringify({
        event: "win",
        player: this.players[0].name
      }));
      user.game = undefined;
      user.players = [];
    }

    games.splice(games.indexOf(this), 1);
    for (let user of onlineUsers)
      user.socket.send(JSON.stringify({ event: "get_games", games }));

    /*blockchain*/
    await this.saveTournament();
    await this.getTournament();
  }

  toJSON() {
    return {
      uid: this.uid,
      name: this.name
    };
  }

  /*blockchain function*/
  async saveTournament() 
  {
    const matchIds: number[] = [];
    const matchScores: number[][] = [];

    for (let i = 0; i < this.tournament.length; i++) {
      const match = this.tournament[i];
      matchIds.push(i);
      matchScores.push([match.score1, match.score2]);
    }

    try {
      await addTournamentMatches(matchIds, matchScores);
      console.log("Blockchain transaction send with success !");
    } catch (err) {
      console.error("Error when the match is send to the smart contract :", err);
    }
  }

  async getTournament() {
    const tournamentId = await idtournament; // + id actual in your database

    try {
      await getTournamentMatches(tournamentId);
      console.log("Blockchain get transaction send with success !");
    } catch (err) {
      console.error("Error when the match is retrieve from the smart contract :", err);
    }
  }
}
