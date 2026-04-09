import 'dotenv/config'
import Fastify, {FastifyRequest} from "fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";

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
await fastify.register(fastifyApollo(apollo), {
  context: async (request: FastifyRequest): Promise<Context> => {
    return {
      db: prisma
    }
  }
});

await fastify.listen({port: 4000, host: "0.0.0.0"});
