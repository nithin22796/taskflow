import { authResolvers } from "./auth";
import { projectResolvers } from "./project";
import { taskResolvers } from "./task";
import { userResolvers } from "./user";

export default {
  Task: {
    ...taskResolvers.Task
  },
  Query: {
    ...authResolvers.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query,
    ...userResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...userResolvers.Mutation
  }
}