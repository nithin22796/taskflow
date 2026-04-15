import { authResolvers } from "./auth";
import { projectResolvers } from "./project";
import { userResolvers } from "./user";

export default {
  Query: {
    ...authResolvers.Query,
    ...projectResolvers.Query,
    ...userResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...userResolvers.Mutation
  }
}