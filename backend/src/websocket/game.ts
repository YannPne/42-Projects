import User from "../User";
import { ClientEvent } from "@ft_transcendence/core";
import { Game, games, GameState } from "../Game";
import { onlineUsers } from "./websocket";
import { chatAnnounceGame } from "./chat";

export default function gameEvents(user: User, message: ClientEvent) {
  if (message.event === "get_games")
    getGames(user);
  else if (message.event === "create_game")
    createGame(user, message);
  else if (message.event === "join_game")
    joinGame(user, message);
  else if (message.event === "get_current_game")
    getCurrentGame(user);
  else if (message.event === "add_local_player")
    addLocalPlayer(user, message);
  else if (message.event === "play")
    play(user);
  else if (message.event === "leave_game")
    leaveGame(user);
  else if (message.event === "move")
    move(user, message);
  else if (message.event == "tournament")
    user.game?.sendTournamentUpdate(user);
  else
    return false;

  return true;
}

function getGames(user: User) {
  user.send({ event: "get_games", games: games.filter(g => g.type == "PUBLIC_TOURNAMENT").map(g => g.toJSON()) });
}

function createGame(user: User, message: ClientEvent & { event: "create_game" }) {
  const game = new Game(message.type, message.type == "LOCAL" ? undefined : message.name);
  games.push(game);
  if (message.type == "PUBLIC_TOURNAMENT") {
    for (let user of onlineUsers)
      user.send({ event: "get_games", games: games.filter(g => g.type == "PUBLIC_TOURNAMENT").map(g => g.toJSON()) });
    chatAnnounceGame(game.uid, message.name);
  }
  game.addUser(user);
  if (message.type == "LOCAL")
    game.addLocalPlayer("AI");
}

function joinGame(user: User, message: ClientEvent & { event: "join_game" }) {
  let game = games.find((g) => g.uid == message.uid);
  if (game == undefined)
    user.send({ event: "join_game", success: false, started: false });
  else {
    game.addUser(user);
    user.send({ event: "join_game", success: true, started: game.state == GameState.IN_GAME });
  }
}

function getCurrentGame(user: User) {
  user.send({ event: "get_current_game", id: user.game?.uid, type: user.game?.type });
}

function addLocalPlayer(user: User, message: ClientEvent & { event: "add_local_player" }) {
  if (!user.game)
    return;

  user.game.addLocalPlayer(message.name, message.isAi ? undefined : user);
}

function play(user: User) {
  if (user.game != undefined) {
    user.game.state = GameState.IN_GAME;
  }
}

function leaveGame(user: User) {
  user.game?.removeUser(user);
}

function move(user: User, message: ClientEvent & { event: "move" }) {
  if (user.game == undefined)
    return;

  // TODO: in Damien's PR, user is given in Player
  const player = user.players.find((p) => p == (message.id == 0 ? user.game?.currentMatch?.player1 : user.game?.currentMatch?.player2));
  if (player == undefined)
    return;

  if (message.goUp != undefined)
    player.goUp = message.goUp;
  if (message.goDown != undefined)
    player.goDown = message.goDown;
}
