import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env.astria")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({path: ".env.astria"});
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];

if (!MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}

export const JWT_SECRET = prod ? process.env["JWT_SECRET"] : process.env["JWT_SECRET_LOCAL"];


if (!JWT_SECRET) {
    logger.error("No JWT Secret Set.");
    process.exit(1);
}