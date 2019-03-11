import express, { Router } from "express";

import rootIndex from "./root";
import adminIndex from "./admin";
import voterIndex from "./voter";
import managerIndex from "./manager";

const router: Router = express.Router();
export default router;

router.use("/", rootIndex);
router.use("/admin", adminIndex);
router.use("/voter", voterIndex);
router.use("/manager", managerIndex);