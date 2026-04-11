import { userResolvers } from "./user";
import { authResolvers } from "./auth";

export default {
  Query: {
    ...authResolvers.Query,
    ...userResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation
  }
}