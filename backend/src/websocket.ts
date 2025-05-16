import { FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import User from "./User";
import { Game, games, GameState } from "./Game";
import { sqlite } from ".";

export let webSocketInstances: WebSocket[] = [];

export default function registerWebSocket(socket: WebSocket, req: FastifyRequest) {
  let user: User | undefined;

  webSocketInstances.push(socket);
  socket.addEventListener("close", () =>
    webSocketInstances.splice(webSocketInstances.indexOf(socket), 1));

  socket.addEventListener("message", async (event) => {
    const message = JSON.parse(event.data);
    switch (message.event) {
      case "get_games":
        getGames(socket);
        break;
      case "join_game":
        joinGame(user!, message);
        break;
      case "add_local_player":
        addLocalPlayer(user!, message);
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
        socket.send(JSON.stringify({
          event: "register",
          success: !!user}));

         if (user != null)
           user!.socket = socket;

        break;
    }
  });
}

function login(message: any) {
  return new Promise<User | null>(async (resolve, reject) => 
  {
      const sql = "SELECT * FROM users WHERE username = ?";
      sqlite.get(sql, message.username, async (err: any, row: any) => {
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

    sqlite.get(sql, message.username, (err: any, row: any) => {
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
      function(err: any) {
        if (err) 
        {
          console.error("Erreur lors de l'insertion :", err.message);
          reject(err);
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
  socket.send(JSON.stringify({ event: "get_games", games }));
}

function joinGame(user: User, message: any) {
  let game = games.find(g => g.uid == message.uid);
  if (game == undefined) {
    games.push(game = new Game(message.name, message.uid));
    for (let webSocket of webSocketInstances) {
      webSocket.send(JSON.stringify({ event: "get_games", games }));
    }
  }
  game.addUser(user);
}

function addLocalPlayer(user: User, message: any) {
  if (message.isAi)
    user.game?.addLocalPlayer(message.name);
  else
    user.game?.addLocalPlayer(message.name, user);
}

function play(user: User) {
  if (user.game != undefined) {
    if (user.game.players.length % 2 != 0)
      user.game.addLocalPlayer("AI");
    user.game.state = GameState.IN_GAME;
  }
}

function move(user: User, message: any) {
  if (user.game == undefined)
    return;

  const player = user.players.find(p => p == user.game?.players[message.id]);
  if (player == undefined)
    return;

  if (message.goUp != undefined)
    player.goUp = message.goUp;
  if (message.goDown != undefined)
    player.goDown = message.goDown;
}