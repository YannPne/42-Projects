import fastify from "fastify";
import fastifyEjs from "@fastify/view";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";
import ejs from "ejs";
import * as path from "node:path";

const app = fastify({ logger: true });

app.register(fastifyEjs, {
  engine: { ejs },
  root: path.join(__dirname, "../views")
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "../public")
});

app.register(fastifyWebsocket);

app.get("/", (request, reply) => {
  return reply.view("/template.ejs", { title: "Bonjour", message: "Ceci est un message dynamique" });
});

app.register(app => {
  app.get("/ws", { websocket: true }, (socket, req) => {
    socket.on("message", (message: any) => {
      socket.send("hi from server");
    });
  });
});

app.listen({ host: "0.0.0.0", port: 8000 }, err => {
  if (err) throw err;
  console.log("Server listening on 8000");
});