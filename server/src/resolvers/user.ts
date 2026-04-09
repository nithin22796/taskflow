import { Context } from "../context"

export const userResolvers = {
  Query: {
    me: (parent, args, context: Context) => {
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
  }
}