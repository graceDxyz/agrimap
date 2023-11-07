import dotenv from "dotenv";
dotenv.config();

import logger from "./utils/logger";

import { env } from "./env";
import { createServer } from "./server";
import connect from "./utils/connect";
import { seed } from "./utils/generated";

const server = createServer();

server.listen(env.PORT, async () => {
  await connect();
  await seed();
  logger.info(`API running on port:${env.PORT}`);
});
