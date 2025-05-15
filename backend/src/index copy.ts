import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import registerWebSocket from "./websocket";
import { verbose } from "sqlite3";
import { error } from "console";

export const sqlite = new (verbose()).Database(':memory:');

sqlite.serialize(() => {
  sqlite.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, pseudo TEXT, password TEXT, avatar BLOB)");
});

const app = fastify({ logger: true });

app.register(fastifyWebsocket);

app.register(app => {
  app.get("/ws", { websocket: true }, registerWebSocket);
});

app.post("/upload/avatar", (req, reply) => {
  console.log(req.headers["Authorize"]);
  const username = req.headers["Authorize"]!.substring(7);

  sqlite.run('UPDATE users SET avatar = ? WHERE username = ?', [req.body, username], (err) => {
    if (err) {
      reply.statusCode = 500;
      reply.send(err.message);
      console.error('Erreur:', err.message);
    }
  });
  reply.statusCode = 204;
});

app.listen({ host: "0.0.0.0", port: 3000 }, err => {
  if (err) throw err;
  console.log("Server listening on 3000");
});