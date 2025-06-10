import User from "../User";
import { ClientEvent } from "@ft_transcendence/core";
import { Game, games, GameState } from "../Game";
import { onlineUsers } from "./websocket";

export default function gameEvents(user: User, message: ClientEvent) {
  if (message.event === "get_games")
    getGames(user);
  else if (message.event === "join_game")
    joinGame(user, message);
  else if (message.event === "add_local_player")
    addLocalPlayer(user, message);
  else if (message.event === "play")
    play(user);
  else if (message.event === "leave_game")
    leaveGame(user);
  else if (message.event === "move")
    move(user, message);
  else if (message.event === "get_tournament") {
    const tournament = user.game?.players.map(u => u.name)!;
    console.log(tournament);
    user.send({ event: "get_tournament", tournament });
  } else
    return false;

  return true;
}

function getGames(user: User) {
  user.send({ event: "get_games", games });
}

function joinGame(user: User, message: ClientEvent & { event: "join_game" }) {
  let game = games.find((g) => g.uid == message.uid);
  if (game == undefined) {
    games.push(game = new Game(message.name!, message.uid));
    for (let user of onlineUsers)
      user.send({ event: "get_games", games });
  }

  const names = game.players.map(p => p.name);
  for (const u of game.users)
    u.send({ event: "get_tournament", tournament: names });
  if (!(game.players.some(u => u.name == user.displayName)))
    game.addUser(user);
}

function addLocalPlayer(user: User, message: ClientEvent & { event: "add_local_player" }) {
  if (!user.game) return;

  user.game.addLocalPlayer(message.name, message.isAi ? undefined : user);

  const names = user.game?.players.map(p => p.name);
  for (const u of user.game.users)
    u.send({ event: "get_tournament", tournament: names });
}

function play(user: User) {
  if (user.game != undefined) {
    if (user.game.players.length % 2 != 0)
      user.game.addLocalPlayer("AI");
    user.game.state = GameState.IN_GAME;
  }
}

function leaveGame(user: User) {
  user.game?.removeUser(user);
}

function move(user: User, message: ClientEvent & { event: "move" }) {
  if (user.game == undefined)
    return;

  const player = user.players.find((p) => p == user.game?.players[message.id]);
  if (player == undefined)
    return;

  if (message.goUp != undefined)
    player.goUp = message.goUp;
  if (message.goDown != undefined)
    player.goDown = message.goDown;
}
