import type { FastifyReply, FastifyRequest } from "fastify";
import type prisma from "../db";

export interface Context {
  db: typeof prisma
  request: FastifyRequest
  reply: FastifyReply
  userId: string | null
}