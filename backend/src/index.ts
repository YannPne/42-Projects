import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import fastifyMulter from "fastify-multer";
import initSqlite from "better-sqlite3";
import registerWebSocket from "./websocket";
import * as dotenv from "dotenv";
import fs from "fs";


dotenv.config();

export const sqlite = initSqlite("./database.sqlite", { verbose: log });

sqlite.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, email TEXT, password TEXT, avatar BLOB)");

sqlite.exec("CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name1 TEXT, name2 TEXT, score1 INTEGER, score2 INTEGER, date DATE)");

sqlite.exec("CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER, name1 TEXT, name2 TEXT, UNIQUE(name1, name2))");


function log(msg) {
  fs.appendFileSync("./log_db.sql", msg + "\n");
}

const app = fastify({ logger: true });

app.register(fastifyWebsocket);


app.register(fastifyMultipart);

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST"]
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

app.register(app => {
  app.get("/ws", { websocket: true }, registerWebSocket);
});

app.post("/upload/avatar", { preHandler: upload.single("avatar") }, async (req: any, reply) => {
  const avatar = req.file;
  const username = req.body.username;
  let buffer;

  if (!username)
    return reply.status(400).send({ error: "Username is required" });

  if (!avatar || !avatar.buffer)
    buffer = null;
  else
    buffer = avatar.buffer;

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
