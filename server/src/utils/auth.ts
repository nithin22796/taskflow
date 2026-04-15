import { Context } from "../context";

export const requireAuth = ({context}: {context: Context}) => {
  const {userId} = context;
  if (!userId) {
    throw new Error("User is not authenticated!");
  }

  return userId;
}