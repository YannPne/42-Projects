import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import registerWebSocket from "./websocket";

const app = fastify({ logger: true });

app.register(fastifyWebsocket);

app.register(app => {
  app.get("/ws", { websocket: true }, registerWebSocket);
});

app.listen({ host: "0.0.0.0", port: 3000 }, err => {
  if (err) throw err;
  console.log("Server listening on 3000");
});