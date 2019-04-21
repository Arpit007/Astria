import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { AuthoriseAdmin } from "../../lib/authenticate";
import { createAstriaVoter } from "../../composer/admin";
import { generateVoterIdPair, generateVoterId } from "../../lib/generator";

const router: Router = express.Router();
export default router;


/**
 * Adds a new voter to the election
 * @param auth_token
 * @param voterId
 * @param electionId
 * @returns {voterId, pin}
 * */
router.post("/addVoter", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {voterId, electionId} = req.body;
        
        const voterIdPair = generateVoterIdPair(voterId, electionId);
        const encVoteId = voterIdPair.voterId;
        const encVoterId = generateVoterId(voterId, electionId);
        
        await createAstriaVoter(userId, encVoterId, encVoteId, electionId);
        
        return Reply(res, 200, {voterId, pin: voterIdPair.pin});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});