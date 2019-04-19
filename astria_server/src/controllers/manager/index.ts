import crypto from "crypto";
import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { encrypt } from "../../util/security";
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
router.post("/createAstriaVoter", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {voterId, electionId} = req.body;
        
        const election = await viewElection(electionId);
        const encVoterId = encrypt(voterId, election.idKey);
        const voterHashId = crypto.createHash("sha256").update(encVoterId).digest("base64");
        
        await createAstriaVoter(userId, voterHashId, electionId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});