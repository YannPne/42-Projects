import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyJwt from "@fastify/jwt";
import initSqlite from "better-sqlite3";
import registerWebSocket from "./websocket";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import fastifyFormbody from "@fastify/formbody";
import Stream from "node:stream";

dotenv.config();

export const sqlite = initSqlite("./database.sqlite", { verbose: console.log });

sqlite.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, displayName TEXT, password TEXT, avatar BLOB)");

const app = fastify({ logger: true });

app.register(fastifyWebsocket);
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!
});
app.register(fastifyMultipart, {
  attachFieldsToBody: false
});
app.register(fastifyFormbody);

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"]
});

app.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const queryToken = (req.query as any).token;

    if (queryToken != undefined) {
      const decoded = app.jwt.verify<any>(queryToken);
      req.jwtUserId = decoded.id;
    } else {
      const decoded: any = await req.jwtVerify();
      req.jwtUserId = decoded.id;
    }
  } catch (err) {
    return reply.send(err);
  }
});

app.register(app => {
  app.get("/ws", { websocket: true, preHandler: [app.authenticate] }, registerWebSocket);
});

app.post("/login", async (request, reply) => {
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
    return reply.status(401).send({ error: "Unauthorized" });

  const token = app.jwt.sign({ id: row.id });
  return reply.status(200).send(token);
});

function streamToBuffer(stream: Stream) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", chunks.push);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

app.post("/register", async (request, reply) => {
  let username: string | undefined;
  let displayName: string | undefined;
  let password: string | undefined;
  let avatar: Stream | undefined;

  for await (let part of request.parts()) {
    if (part.fieldname == "username" && part.type == "field")
      username = part.value as string;
    else if (part.fieldname == "displayName" && part.type == "field")
      displayName = part.value as string;
    else if (part.fieldname == "password" && part.type == "field")
      password = part.value as string;
    else if (part.fieldname == "avatar" && part.type == "file") {
      if (part.filename)
        avatar = part.file;
    } else
      return reply.status(400).send("Invalid part");
  }

  if (!username || !displayName || !password)
    return reply.status(400).send("Incomplete request");
  let buffer = avatar ? await streamToBuffer(avatar) : null;
  console.log(buffer);

  const result = sqlite.prepare(`INSERT INTO users (username, displayName, password, avatar)
                                 SELECT ?, ?, ?, ? WHERE NOT EXISTS(SELECT 1 FROM users WHERE username = ?)`)
    .run(username, displayName, bcrypt.hashSync(password, 10), buffer, username);

  if (result.changes == 0)
    return reply.status(409).send("Username already exist");

  return reply.status(200).send(app.jwt.sign({ id: result.lastInsertRowid }));
});

app.listen({ host: "0.0.0.0", port: 3000 }, (err) => {
  if (err) throw err;
  console.log("Server listening on 3000");
});
