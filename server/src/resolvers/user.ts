import bcrypt from "bcrypt";
import { Context } from "../context"
import { Prisma } from "../generated/prisma/client";

export const userResolvers = {
  Query: {
    me: async (parent, args, context: Context) => {
      const {db, userId} = context;
      if (userId) {
        try {
          const user = await db.user.findFirst({where: {id: userId}})
          return user;
        } catch {
          console.warn("User not found!");
          return null;
        }
      }
      return null;
    },
    user: (parent, args, context: Context) => {
      const {input: {id, email} = {}} = args;
      return context.db.user.findFirst({ where: {
        OR: [
          {id},
          {email}
        ]
      }})
    }
  },
  Mutation: {}
}