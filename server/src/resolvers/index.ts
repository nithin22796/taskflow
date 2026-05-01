import { authResolvers } from "./auth";
import { commentsResolver } from "./comment";
import { projectResolvers } from "./project";
import { taskResolvers } from "./task";
import { userResolvers } from "./user";

export default {
  Task: {
    ...taskResolvers.Task
  },
  Query: {
    ...authResolvers.Query,
    ...commentsResolver.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query,
    ...userResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...commentsResolver.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...userResolvers.Mutation
  }
}