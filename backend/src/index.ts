import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyMultipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import initSqlite from "better-sqlite3";
import registerWebSocket from "./websocket";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import fastifyFormbody from "@fastify/formbody";
import fs from "fs";

dotenv.config();

export const sqlite = initSqlite("./database.sqlite", { verbose: (msg) => fs.appendFileSync("./log_db.sql", msg + ";\n") });

sqlite.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    displayName TEXT,
    email TEXT,
    password TEXT,
    avatar BLOB
)`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS games (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    name1  TEXT,
    name2  TEXT,
    score1 INTEGER,
    score2 INTEGER,
    date DATE
)`);
sqlite.exec(`CREATE TABLE IF NOT EXISTS friends (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    userid   INTEGER,
    friendid INTEGER,
    UNIQUE (userid, friendid),
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (friendid) REFERENCES users (id) ON DELETE CASCADE
)`);

const app = fastify({ logger: true });

app.register(fastifyWebsocket);
app.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
app.register(fastifyMultipart, { attachFieldsToBody: false });
app.register(fastifyFormbody);

app.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const queryToken = (req.query as any).token;
    const decoded = queryToken != undefined ? app.jwt.verify<any>(queryToken) : await req.jwtVerify();
    req.jwtUserId = decoded.id;
  } catch (err) {
    return reply.send(err);
  }
});

app.register(app => {
  app.get("/api/ws", { websocket: true, preHandler: [app.authenticate] }, registerWebSocket);
});

app.post("/api/login", async (request, reply) => {
  let username: string | undefined;
  let password: string | undefined;

  for await (let part of request.parts()) {
    if (part.fieldname == "username" && part.type == "field")
      username = part.value as string;
    else if (part.fieldname == "password" && part.type == "field")
      password = part.value as string;
    else
      return reply.status(400).send("Invalid part");
  }

  if (!username || !password)
    return reply.status(400).send("Incomplete request");

  const row: any = sqlite.prepare("SELECT id, password FROM users WHERE username = ?")
    .get(username);

  if (row == undefined || !bcrypt.compareSync(password, row.password))
    return reply.status(401).send("Unauthorized");

  const token = app.jwt.sign({ id: row.id });
  return reply.status(200).send(token);
});

app.post("/api/register", async (request, reply) => {
  let username: string | undefined;
  let displayName: string | undefined;
  let email: string | undefined;
  let password: string | undefined;
  let avatar: Buffer | null = null;

  for await (let part of request.parts()) {
    if (part.fieldname == "username" && part.type == "field")
      username = part.value as string;
    else if (part.fieldname == "displayName" && part.type == "field")
      displayName = part.value as string;
    else if (part.fieldname == "email" && part.type == "field")
      email = part.value as string;
    else if (part.fieldname == "password" && part.type == "field")
      password = part.value as string;
    else if (part.fieldname == "avatar" && part.type == "file") {
      if (part.filename) {
        const chunks: Buffer[] = [];
        for await (let chunk of part.file)
          chunks.push(chunk);
        avatar = Buffer.concat(chunks);
      }
    } else
      return reply.status(400).send("Invalid part");
  }

  if (!username || !displayName || !email || !password)
    return reply.status(400).send("Incomplete request");

  const result = sqlite.prepare(`INSERT INTO users (username, displayName, email, password, avatar)
                                 SELECT ?,
                                        ?,
                                        ?,
                                        ?,
                                        ? WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = ?)`)
    .run(username, displayName, email, bcrypt.hashSync(password, 10), avatar, username);

  if (result.changes == 0)
    return reply.status(409).send("Username already exist");

  return reply.status(200).send(app.jwt.sign({ id: result.lastInsertRowid }));
});

app.listen({ host: "0.0.0.0", port: 3000 }, (err) => {
  if (err) throw err;
  console.log("Server listening on 3000");
});
