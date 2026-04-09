import { userResolvers } from "./user";

export default {
  Query: {
    ...userResolvers.Query
  }
}