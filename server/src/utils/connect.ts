import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import logger from "@/utils/logger";

async function connect() {
  const dbUri = config.get<string>("dbUri");
  try {
    await mongoose.connect(dbUri);
    logger.info("DB connection established");
  } catch (error) {
    logger.error("Could not connect to db");
    process.exit(1);
  }
}

export default connect;
