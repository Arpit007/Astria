import express, { Request, Response, Router } from "express";

import Reply from "../util/reply";

const router: Router = express.Router();
export default router;

router.get("/", (req: Request, res: Response) => {
    return Reply(res, 200, {msg: "Astria Server asdf"});
});