import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { castVote } from "../../composer/voter";
import { AuthoriseVoter } from "../../lib/authenticate";
import { getAdmin } from "../../composer/allParticipants";
import { encrypt } from "../../util/security";

const router: Router = express.Router();
export default router;


/**
 * Allows a voter to cast the vote
 * @param auth_token
 * @param candidateId
 * */
router.post("/castVote", AuthoriseVoter, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId, resourceId} = req.user;
        const {candidateId} = req.body;
    
        const admin = await getAdmin(userId, resourceId);
        const encCandidateId = encrypt(candidateId, admin.voteKey);
        
        await castVote(userId, encCandidateId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Allows a user to verify their vote
 * */
router.post("/verifyVote", AuthoriseVoter, async (req, res) => {
    return Reply(res, 404, "Not Implemented");
});