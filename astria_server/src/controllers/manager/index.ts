import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { generateVoterId } from "../../lib/generator";
import { AuthoriseAdmin } from "../../lib/authenticate";
import { createAstriaVoter } from "../../composer/admin";

const router: Router = express.Router();
export default router;


/**
 * Adds a new voter to the election
 * @param auth_token
 * @param voterId
 * @param electionId
 * */
router.post("/addVoter", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {voterId, electionId} = req.body;
        
        const encVoterId = generateVoterId(voterId, electionId);
        
        await createAstriaVoter(userId, encVoterId.voterId, electionId);
        
        return Reply(res, 200, {pin: encVoterId.pin});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});