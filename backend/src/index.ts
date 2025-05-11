import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import registerEndpoints from "./endpoints";

const app = fastify({ logger: true });

app.register(fastifyWebsocket);

registerEndpoints(app);

app.listen({ host: "0.0.0.0", port: 3000 }, err => {
  if (err) throw err;
  console.log("Server listening on 3000");
});