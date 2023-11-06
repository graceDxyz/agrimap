import mongoose from "mongoose";
import { env } from "../env";
import logger from "./logger";

async function connect() {
  try {
    await mongoose.connect(env.DB_CONNECTION, {
      dbName: "agrimap",
    });
    logger.info("DB connection established");
  } catch (error) {
    logger.error("Could not connect to db");
    logger.error(error);
    process.exit(1);
  }
}

export default connect;
