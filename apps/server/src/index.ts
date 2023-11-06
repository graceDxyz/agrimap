import dotenv from "dotenv";
dotenv.config();

import logger from "./utils/logger";

import { env } from "./env";
import { createServer } from "./server";

const server = createServer();

server.listen(env.PORT, async () => {
  logger.info(`API running on port:${env.PORT}`);
});
