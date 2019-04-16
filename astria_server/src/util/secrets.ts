import fs from "fs";
import dotenv from "dotenv";

import logger from "./logger";

const envFile = ".env.astria";

if (fs.existsSync(envFile)) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({path: envFile});
}


export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const AUTH_SERVER = prod ? process.env["AUTH_SERVER"] : process.env["AUTH_SERVER_LOCAL"];
if (!AUTH_SERVER) {
    logger.error("Astria authorisation server endpoint not set");
    process.exit(1);
}