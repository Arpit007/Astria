import dotenv from "dotenv";
import fs from "fs";

import logger from "./logger";

if (fs.existsSync(".env.astria")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({path: ".env.astria"});
}