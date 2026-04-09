import type prisma from "../db";

export interface Context {
  db: typeof prisma
}