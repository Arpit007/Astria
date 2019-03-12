import express, { Request, Response, Router } from "express";
import { AuthoriseUser } from "../../lib/authenticate";
import Reply from "../../util/Reply";
import { addVoter } from "../../composer/manager";
import { getAdmin } from "../../composer/allParticipants";

const router: Router = express.Router();
export default router;


/**
 * Adds a new voter to the election
 * @param auth_token
 * @param voterId
 * */
router.post("/addVoter", AuthoriseUser, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId, resourceId} = req.user;
        const {voterId} = req.body;
        
        const admin = await getAdmin(userId, resourceId);
        // Todo: Encrypt VoterId
        const encVoterId = voterId;
        
        await addVoter(userId, encVoterId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});