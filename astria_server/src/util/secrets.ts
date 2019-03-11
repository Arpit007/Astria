import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env.astria")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({path: ".env.astria"});
}