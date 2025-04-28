import Fastify from "fastify";
import * as dotenv from "dotenv";
import { chatRoutes } from "./routes/chatRoute";

dotenv.config();

async function start() {
  const fastify = Fastify({ logger: true });

  await fastify.register(chatRoutes);

  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
