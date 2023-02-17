import mongoose from "mongoose";
import config from "../shared/config";
import logger from "./logger";

export const initDb = async () => {
  try {
    await mongoose.connect(config.db.MONGO_URI);
    logger.info("Successfully connected to the database");
  } catch (error) {
    logger.error(`Failed to connect to the database: ${error}`);
    process.exit(1);
  }
};
