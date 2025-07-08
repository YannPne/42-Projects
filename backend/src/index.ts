import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyMultipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import initSqlite from "better-sqlite3";
import registerWebSocket from "./websocket/websocket";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import fastifyFormbody from "@fastify/formbody";
import fs from "fs";
import { getTotpCode } from "./2fa";

dotenv.config();

export const sqlite = initSqlite("./database.sqlite", { verbose: (msg) => fs.appendFileSync("./log_db.sql", msg + ";\n") });

sqlite.exec(`CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username    TEXT NOT NULL UNIQUE,
    displayName TEXT NOT NULL UNIQUE,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    avatar      BLOB DEFAULT NULL,
    secret2fa   TEXT DEFAULT NULL,
    hideProfile BOOLEAN NOT NULL DEFAULT 0,
    recover     TEXT DEFAULT NULL
)`);

sqlite.exec(`CREATE TABLE IF NOT EXISTS games (
    id            INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    player1_id    INTEGER,
    player1_name  TEXT,
    player1_score INTEGER NOT NULL,
    player2_id    INTEGER,
    player2_name  TEXT,
    player2_score INTEGER NOT NULL,
    date          DATE NOT NULL DEFAULT CURRENT_DATE,
    
    FOREIGN KEY (player1_id) REFERENCES users (id) ON DELETE SET NULL,
    FOREIGN KEY (player2_id) REFERENCES users (id) ON DELETE SET NULL
)`);

sqlite.exec(`CREATE TABLE IF NOT EXISTS friends (
    id       INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    userid   INTEGER NOT NULL,
    friendid INTEGER NOT NULL,
    UNIQUE (userid, friendid),
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (friendid) REFERENCES users (id) ON DELETE CASCADE
)`);

sqlite.exec(`CREATE TABLE IF NOT EXISTS blocked (
    id        INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    userid    INTEGER NOT NULL,
    blockedid INTEGER NOT NULL,
    UNIQUE(userid, blockedid)
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

    if (sqlite.prepare("SELECT id FROM users WHERE id = ?").run(decoded.id) == undefined)
      return reply.status(401).send("Unauthorized");
  } catch (err) {
    return reply.send(err);
  }
});

app.register(app => {
  app.get("/api/ws", { websocket: true, preHandler: [ app.authenticate ] }, registerWebSocket);
});

app.post("/api/require_2fa", (request, reply) => {
  const row: any = sqlite.prepare("SELECT secret2fa FROM users WHERE username = ?")
    .get(request.body);

  return reply.send(row != undefined && row.secret2fa != null);
});

app.post("/api/login", async (request, reply) => {
  let username: string | undefined;
  let password: string | undefined;
  let code2fa: string | undefined;

  for await (let part of request.parts()) {
    if (part.fieldname == "username" && part.type == "field")
      username = part.value as string;
    else if (part.fieldname == "password" && part.type == "field")
      password = part.value as string;
    else if (part.fieldname == "2fa" && part.type == "field")
      code2fa = part.value as string;
    else
      return reply.status(400).send("Invalid part");
  }

  if (!username || !password)
    return reply.status(400).send("Incomplete request");

  const row: any = sqlite.prepare("SELECT id, password, secret2fa FROM users WHERE username = ?")
    .get(username);

  if (row == undefined || !bcrypt.compareSync(password, row.password))
    return reply.status(401).send("Unauthorized");
  if (row.secret2fa != null && await getTotpCode(row.secret2fa) != code2fa)
    return reply.status(403).send("Forbidden");
  return reply.status(200).send(app.jwt.sign({ id: row.id }));
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

  if (!/[\w-]{3,16}/.test(username))
    return reply.status(400).send("The username length must be between 3 and 16. And can only contain alphanumeric characters, _ and -");

  if (!/^[\w- ]{3,16}$/.test(displayName))
    return reply.status(400).send("The display name length must be between 3 and 16. And can only contain alphanumeric characters, _, - and spaces.");

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password))
    return reply.status(400).send("The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.");

  if (!/^[\w-.+]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
    return reply.status(400).send("Invalid email");

  try {
    const result = sqlite.prepare(`INSERT INTO users (username, displayName, email, password, avatar)
        SELECT ?, ?, ?, ?, ?`)
      .run(username, displayName, email, bcrypt.hashSync(password, 10), avatar);
    return reply.status(200).send(app.jwt.sign({ id: result.lastInsertRowid }));
  } catch (e) {
    return reply.status(409).send("Username / Display Name / Email already exist");
  }
});

app.post("/api/recover/request", (request, reply) => {
  const email = request.body as string;

  sqlite.prepare("UPDATE users SET recover = ? WHERE email = ?")
    .run(crypto.randomUUID(), email);
  // In prod, a mail must be sent if changes > 0
  return reply.status(204).send();
});

app.post("/api/recover/submit", (request, reply) => {
  const { key, password } = request.body as any;

  if (key == undefined || password == undefined)
    return reply.status(400).send("Invalid request");

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password))
    return reply.status(400).send("The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.");

  const result = sqlite.prepare("UPDATE users SET password = ?, recover = NULL WHERE recover = ?")
    .run(bcrypt.hashSync(password, 10), key);

  if (result.changes > 0)
    return reply.status(204).send();
  else
    return reply.status(401).send("The recover key is not valid, please use the URL provided in the mail.");
});

app.listen({ host: "0.0.0.0", port: 3000 }).then(console.log);
