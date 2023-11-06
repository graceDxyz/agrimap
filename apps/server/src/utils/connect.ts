import config from "config";
import mongoose from "mongoose";
import logger from "./logger";

async function connect() {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri, {      
      dbName:"agrimap",
    });
    logger.info("DB connection established");
  } catch (error) {
    logger.error("Could not connect to db");
    logger.error(error)
    process.exit(1);
  }
}

export default connect;
