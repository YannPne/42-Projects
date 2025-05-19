import { FastifyInstance, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }

  interface FastifyRequest {
    jwtUserId: number;
  }
}