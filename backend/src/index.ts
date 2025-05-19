import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import fastifyMulter from "fastify-multer";
import initSqlite from "better-sqlite3";
import registerWebSocket from "./websocket";
import * as dotenv from "dotenv";

dotenv.config();

export const sqlite = initSqlite("./database.sqlite", { verbose: console.log });

sqlite.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, password TEXT, avatar BLOB)");

const app = fastify({ logger: true });

app.register(fastifyWebsocket);
// app.register(fastifyJwt, {
//   secret:
// });
app.register(fastifyMultipart);

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"]
});

const upload = fastifyMulter({
  storage: fastifyMulter.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  }
});

app.register((app) => {
  app.get("/ws", { websocket: true }, registerWebSocket);
});

app.post("/upload/avatar", { preHandler: upload.single("avatar") }, async (req: any, reply) => {
  const avatar = req.file;
  const username = req.body.username;

  if (!avatar)
    return reply.status(400).send({ error: "Avatar is required" });
  if (!username)
    return reply.status(400).send({ error: "Username is required" });

  const buffer = avatar.buffer;

  const result = sqlite.prepare("UPDATE users SET avatar = ? WHERE username = ?")
    .run(buffer, username);

  if (result.changes == 0)
    return reply.status(404).send({ error: "User not found" });
  return reply.status(204).send();
});

app.listen({ host: "0.0.0.0", port: 3000 }, (err) => {
  if (err) throw err;
  console.log("Server listening on 3000");
});
