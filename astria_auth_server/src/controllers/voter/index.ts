import express, { Request, Response, Router } from "express";
import Reply from "../../util/Reply";

const router: Router = express.Router();
export default router;

router.post("/verify", (req: Request, res: Response) => {
    // Todo: Implement
    const {auth_token} = req.body;
    return Reply(res, 200, {user: {userId: auth_token}});
});


router.post("/signIn", (req: Request, res: Response) => {
    // Todo: Implement
    const {userId} = req.body;
    return Reply(res, 200, {user: {userId}});
});