import express, { Request, Response, Router } from "express";
import Reply from "../../util/Reply";

const router: Router = express.Router();
export default router;

router.post("/verify", (req: Request, res: Response) => {
    // Todo: Implement
    const {userId} = req.body;
    return Reply(res, 200, {userId});
});