import mongoose from "mongoose";
import config from "config";
import logger from "../utils/logger";

async function connect() {
  const dbUri = config.get<string>("dbUri");

  console.log({ dbUri });
  try {
    await mongoose.connect(dbUri);
    logger.info("DB connection established");
  } catch (error) {
    logger.error("Could not connect to db", error);
    process.exit(1);
  }
}

export default connect;
