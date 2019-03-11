import express, { Router } from "express";

import etcIndex from "./etc";
import rootIndex from "./root";
import adminIndex from "./admin";
import voterIndex from "./voter";
import managerIndex from "./manager";
import app from "../app";
import Reply from "../util/Reply";

const router: Router = express.Router();
export default router;

router.use("/", rootIndex);
router.use("/etc", etcIndex);
router.use("/admin", adminIndex);
router.use("/voter", voterIndex);
router.use("/manager", managerIndex);