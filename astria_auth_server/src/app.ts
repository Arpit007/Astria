import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "passport";
import expressValidator from "express-validator";

import "./bootstrap";
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
app.use(lusca.xssProtection(true));

// Setup Controllers
app.use("/", indexController);

export default app;