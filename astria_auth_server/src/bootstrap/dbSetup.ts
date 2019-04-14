import mongoose from "mongoose";
import { MONGODB_URI } from "../util/secrets";
import bluebird from "bluebird";
import logger from "../util/logger";

const mongoUrl = MONGODB_URI;

(<any>mongoose).Promise = bluebird;

mongoose.connect(mongoUrl, {useNewUrlParser: true})
    .then(() => {
    })
    .catch((err: Error) => {
        logger.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
        process.exit(0);
    });

mongoose.connection.on("connected", () => logger.info("Database connected"));

mongoose.connection.on("error", (err: Error) => logger.error("Database connection error: " + err));

mongoose.connection.on("disconnected", () => logger.info("Database disconnected"));

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        logger.info("Database disconnected through app termination");
        process.exit(0);
    });
});


export { mongoUrl };