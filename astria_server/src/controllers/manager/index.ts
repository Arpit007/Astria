import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { generateVoterId } from "../../lib/generator";
import { AuthoriseAdmin } from "../../lib/authenticate";
import { createAstriaVoter } from "../../composer/admin";
import { viewElection } from "../../composer/allParticipants";

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
        
        const election = await viewElection(electionId);
        const encVoterId = generateVoterId(voterId, electionId, election.idKey);
        
        await createAstriaVoter(userId, encVoterId, electionId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});