import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import registerWebSocket from "./websocket";
import { verbose } from "sqlite3";
import cors from "@fastify/cors";
import fastifyMultipart from '@fastify/multipart';
import fastifyMulter from 'fastify-multer';

export const sqlite = new (verbose()).Database(':memory:');

sqlite.serialize(() => {
  sqlite.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, pseudo TEXT, password TEXT, avatar BLOB)");
});

const app = fastify({ logger: true });

app.register(fastifyWebsocket);

app.register(app => {
  app.get("/ws", { websocket: true }, registerWebSocket);
});

// ✅ Important : fastify-multipart d'abord
app.register(fastifyMultipart);

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
});

// ✅ Ensuite fastify-multer (qui utilise fastify-multipart)
const upload = fastifyMulter({
  dest: './uploads',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seules les images sont autorisées'));
    }
    cb(null, true);
  }
});

// ❌ Ne PAS faire upload.contentParser (déjà géré par fastify-multipart)

app.post('/upload/avatar', { preHandler: upload.single('avatar') }, async (req, reply) => {
  const avatar = req.file;

  if (!avatar) {
    return reply.status(400).send({ error: 'Aucun fichier reçu' });
  }

  return reply.send({
    message: 'Avatar bien reçu',
    filename: avatar.filename,
    mimetype: avatar.mimetype,
    size: avatar.size,
    path: avatar.path
  });
});

app.listen({ host: "0.0.0.0", port: 3000 }, err => {
  if (err) throw err;
  console.log("Server listening on 3000");
});
