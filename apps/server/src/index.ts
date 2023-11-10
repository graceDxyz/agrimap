import dotenv from "dotenv";
dotenv.config();

import logger from "./utils/logger";

import { env } from "./env";
import { createServer } from "./server";
import connect from "./utils/connect";
import { seed } from "./utils/generated";

const server = createServer();

const app = server.listen(env.PORT, async () => {
  await connect();
  await seed();
  logger.info(`API running on port:${env.PORT}`);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received.");
  logger.info("Closing http server.");
  app.close((err) => {
    logger.info("Http server closed.");
    process.exit(err ? 1 : 0);
  });
});
