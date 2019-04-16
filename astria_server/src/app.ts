import lusca from "lusca";
import morgan from "morgan";
import express from "express";
import passport from "passport";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import compression from "compression";
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
app.use(passport.initialize());
app.use(lusca.xframe("SAMEORIGIN"));

app.use(indexController);

export default app;