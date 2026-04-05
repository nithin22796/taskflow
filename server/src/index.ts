import Fastify from "fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";

import { typeDefs } from "./schema";

const resolvers = {
  Query: {
  }
}

const fastify = Fastify({ logger: true })

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(fastify)]
});

await apollo.start();
await fastify.register(fastifyApollo(apollo));

await fastify.listen({port: 4000, host: "0.0.0.0"});
