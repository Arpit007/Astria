import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import * as dotenv from "dotenv";
import morgan from "morgan";
import expressValidator from "express-validator";

import indexController from "./controllers";

dotenv.config({path: ".env.example"});

const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(lusca.xframe("SAMEORIGIN"));

// Setup Controllers
app.use("/", indexController);

export default app;