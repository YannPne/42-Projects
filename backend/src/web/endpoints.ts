import { FastifyInstance } from "fastify";
import { Game, games, GameState } from "../Game";
import Player from "../Player";
import User from "../User";

export default function registerEndpoints(app: FastifyInstance) {
  app.get("/", (request, reply) => {
    return reply.view("/main.ejs", { title: "Bonjour", message: "Ceci est un message dynamique" });
  });

  app.register(app => {
    app.get("/ws", { websocket: true }, (socket, req) => {
      const user = new User("Player");
      user.socket = socket;

      socket.on("message", (message: any) => {
        message = JSON.parse(message);
        switch (message.event) {
          case "join_game":
            let game = games.find(g => g.uid == message.uid);
            if (game == undefined) {
              game = new Game(message.name, message.uid);
              games.push(game);
            }

            game.players.push(user.player = new Player(game, { isAi: false, user }));
            break;
          case "play":
            if (user.player) {
              if (user.player.game.players.length % 2 != 0)
                user.player.game.players.push(new Player(user.player.game, {isAi: true, name: "IA"}));
              user.player.game.state = GameState.IN_GAME;
            }
            break;
          case "move":
            if (user.player) {
              if (message.goUp != undefined)
                user.player.goUp = message.goUp;
              if (message.goDown != undefined)
                user.player.goDown = message.goDown;
            }
            break;
        }
      });
    });
  });
}