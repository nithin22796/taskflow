import { Context } from "../context"
import { requireAuth } from "../utils/auth";

export const userResolvers = {
  Query: {
    me: async (parent, args, context: Context) => {
      const {db} = context;
      const userId = requireAuth({context});
      const user = await db.user.findFirst({where: {id: userId}})
      return user;
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