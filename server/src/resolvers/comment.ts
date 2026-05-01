import { Context } from "../context";
import { createComment, deleteComment, updateComment } from "../services/comment";
import { requireAuth } from "../utils/auth";


export const commentsResolver = {
  Query: {},
  Mutation: {
    createComment: async (parent, args, context: Context) => {
      requireAuth({context});

      const comment = await createComment({context, input: args.input});
      return comment;
    },
    updateComment: async (parent, args, context: Context) => {
      requireAuth({context});

      const comment = await updateComment({context, input: args.input});
      return comment;
    },
    deleteComment: async (parent, args, context: Context) => {
      requireAuth({context});

      const commentId = await deleteComment({context, input: args.input});
      return commentId;
    }
  }
}