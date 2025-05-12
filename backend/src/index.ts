import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import registerWebSocket from "./websocket";
import { verbose } from "sqlite3";

export const sqlite = new (verbose()).Database(':memory:');

sqlite.serialize(() => {
  sqlite.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

const app = fastify({ logger: true });

app.register(fastifyWebsocket);

app.register(app => {
  app.get("/ws", { websocket: true }, registerWebSocket);
});

app.listen({ host: "0.0.0.0", port: 3000 }, err => {
  if (err) throw err;
  console.log("Server listening on 3000");
});