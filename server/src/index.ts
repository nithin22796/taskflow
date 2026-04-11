import 'dotenv/config'
import Fastify, {FastifyReply, FastifyRequest} from "fastify";
import fastifyCookie from '@fastify/cookie'
import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import jwt from "jsonwebtoken";

import { typeDefs } from "./schema";
import prisma from "./db";
import { Context } from "./context";
import resolvers from "./resolvers";

const fastify = Fastify({ logger: true })

const apollo = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(fastify)]
});

await apollo.start();
await fastify.register(fastifyCookie);
await fastify.register(fastifyApollo(apollo), {
  context: async (request: FastifyRequest, reply: FastifyReply): Promise<Context> => {
    let userId = null;

    const token = request.cookies.accessToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {id: string}
        userId = decoded.id;
      } catch {
        console.warn("Token invalid or expired");
      }
    }

    return {
      db: prisma,
      reply,
      request,
      userId
    }
  }
});

await fastify.listen({port: 4000, host: "0.0.0.0"});
