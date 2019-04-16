import express, { Request, Response, Router } from "express";
import { AuthoriseAdmin } from "../../lib/authenticate";
import Reply from "../../util/reply";
import { addVoter } from "../../composer/manager";
import { getAdmin } from "../../composer/allParticipants";
import { encrypt } from "../../util/security";

const router: Router = express.Router();
export default router;


/**
 * Adds a new voter to the election
 * @param auth_token
 * @param voterId
 * */
router.post("/addVoter", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId, resourceId} = req.user;
        const {voterId} = req.body;
        
        const admin = await getAdmin(userId, resourceId);
        const encVoterId = encrypt(voterId, admin.idKey); // Todo: Hash it
        
        await addVoter(userId, encVoterId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});