import { FastifyRequest } from "fastify";
import User from "./User";
import { Game, games, GameState } from "./Game";
import Player from "./Player";
import { sqlite } from ".";
import { setTimeout } from "timers";
import bcrypt from "bcrypt";
import { resolve } from "path";

//import type { WebSocket } from "ws"; // <-- CE TYPE ICI

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  let user: User | undefined;

  socket.addEventListener("message", async (event) => {
    //const message = JSON.parse(data.toString());
  
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
        const response = await login(message);

        socket.send(JSON.stringify({
          event: "login",
          success: response != null
        }));
        
        if (response != null)
        { 
          user = response;
          user!.socket = socket;
        }
        break;
      case "register":

        user = await register(socket, message);

        if (user != null)
        {
          socket.send(JSON.stringify({
            event: "register",
            success: true}));

          user!.socket = socket;
        }
        else
        {
          socket.send(JSON.stringify({
            event: "register",
            success: false}));
        }

        break;
    }
  });
}

function login(message: any) {
  return new Promise<User | null>(async (resolve, reject) => 
  {
      const sql = "SELECT * FROM users WHERE username = ?";

      sqlite.get(sql, message.username, async (err, row: any) => {
      if (!err)
      {
        if (!row)
          resolve(null);
        else if (await bcrypt.compare(message.password, row.password))
          resolve(new User(row.id, row.username));
        else
          resolve(null);
      }
      else
      {
        reject(err);
      }
    });
    setTimeout(() => reject("Timeout"), 5_000);
  });
}

function  user_exist(message: any): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE username = ?";

    sqlite.get(sql, message.username, (err, row: any) => {
      if (err) 
      {
        reject(err);
      } 
      else 
      {
        resolve(!!row);
      }
    });

    setTimeout(() => reject(new Error("Timeout")), 5_000);
  });
}


async function register(socket: WebSocket, message: any) {
  const exist = await user_exist(message)

  if (exist)
    return undefined;
    
  return new Promise<User>(async (resolve, reject) => {
    sqlite.run("INSERT INTO users (username, pseudo, password) VALUES (?, ?, ?)", [message.username, message.pseudo, await bcrypt.hash(message.password, 10)],
      function (err: any) {
        if (err) 
        {
          console.error("Erreur lors de l'insertion :", err.message);
        } 
        else 
        {
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