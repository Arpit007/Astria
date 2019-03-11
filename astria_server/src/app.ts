import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";
import expressValidator from "express-validator";

import "./bootstrap/dbSetup";
import indexController from "./controllers/index";

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
app.use(lusca.xssProtection(true));
app.use(express.static(path.join(__dirname, "../public"), {maxAge: 31557600000}));

// Setup Controllers
app.use("/", indexController);

export default app;