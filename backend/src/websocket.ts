import { FastifyRequest } from "fastify";
import User from "./User";
import { Game, games, GameState } from "./Game";
import Player from "./Player";
import { sqlite } from ".";
import { setTimeout } from "timers";
import bcrypt from "bcrypt";
import { resolve } from "path";

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  let user: User | undefined;

  socket.addEventListener("message", async (event) => {
    const message = JSON.parse(event.data);
    switch (message.event) {
      case "get_games":
        getGames(socket);
        break;
      case "join_game":
        joinGame(user!, message);
        break;
      case "play":
        play(user!);
        break;
      case "move":
        move(user!, message);
        break;
      case "login":
        user = await login(message);
        user!.socket = socket;
        break;
      case "register":
        user = await register(message);
        user!.socket = socket;
        break;
    }
  });
}
function login(message: any) {
  return new Promise<User>(async (resolve, reject) => 
  {
      const sql = "SELECT * FROM users WHERE username = ?";

      sqlite.get(sql, message.username, async (err, row) => {
      if (row)
      {
        const userRow = row as { id: number; username: string; password: string };
        const isMatch = await bcrypt.compare(message.password, userRow.password);
        
        if (!isMatch) 
          return reject("Mot de passe incorrect");    

        resolve(new User(userRow.id, userRow.username));
      }
      else
      {
        reject("User not found");
      }
    });
    setTimeout(() => reject("Timeout"), 5000);
  });
}


function register(message: any) {
  return new Promise<User>(async (resolve, reject) => {
    sqlite.run("INSERT INTO users (username, password) VALUES (?, ?)", [message.username, await bcrypt.hash(message.password, 10)],
      function (err) {
        if (err) {
          console.error("Erreur lors de l'insertion :", err.message);
        } else {
          console.error("register valide");
          resolve(new User(this.lastID, message.username));
        }
      }
    );

    setTimeout(() => reject("Timeout"), 5_000);
  });
}

function getGames(socket: WebSocket) {
  socket.send(JSON.stringify({
    event: "get_games",
    games: games.map(g => {
      return { name: g.name, uid: g.uid };
    })
  }));
}

function joinGame(user: User, message: any) {
  let game = games.find(g => g.uid == message.uid);
  if (game == undefined)
    games.push(game = new Game(message.name, message.uid));

  game.players.push(user.player = new Player(game, { isAi: false, user }));
}

function play(user: User) {
  if (user.player != undefined) {
    if (user.player.game.players.length % 2 != 0)
      user.player.game.players.push(new Player(user.player.game, {isAi: true, name: "IA"}));
    user.player.game.state = GameState.IN_GAME;
  }
}

function move(user: User, message: any) {
  if (user.player != undefined) {
    if (message.goUp != undefined)
      user.player.goUp = message.goUp;
    if (message.goDown != undefined)
      user.player.goDown = message.goDown;
  }
}