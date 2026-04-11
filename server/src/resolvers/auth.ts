import jwt from "jsonwebtoken";

import { Context } from "../context";
import { login, register } from "../services/auth";

export const authResolvers = {
  Query: {},
  Mutation: {
    register: async (parent, args, context: Context) => {
      const createdUser = await register({context, input: args.input});

      const accessToken = jwt.sign({
          id: createdUser.id,
          name: createdUser.name
        },
        process.env.JWT_ACCESS_SECRET!,
        {expiresIn: "5m"}
      )

      const refreshToken = jwt.sign({
          id: createdUser.id
        },
        process.env.JWT_REFRESH_SECRET!,
        {expiresIn: "7d"}
      )

      context.reply.setCookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 5,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      context.reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      return createdUser;
    },
    login: async (parent, args, context: Context) => {
      const user = await login({input: args.input, context});

      if (!user) {
        return user;
      }

      const accessToken = jwt.sign({
          id: user.id,
          name: user.name
        },
        process.env.JWT_ACCESS_SECRET!,
        {expiresIn: "5m"}
      )

      const refreshToken = jwt.sign({
          id: user.id
        },
        process.env.JWT_REFRESH_SECRET!,
        {expiresIn: "7d"}
      )

      context.reply.setCookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 5,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      context.reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })

      return user;
    }
  }
}