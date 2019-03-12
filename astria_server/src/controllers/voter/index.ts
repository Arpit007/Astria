import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { castVote } from "../../composer/voter";
import { AuthoriseUser } from "../../lib/authenticate";

const router: Router = express.Router();
export default router;


/**
 * Allows a voter to cast the vote
 * @param auth_token
 * @param candidateId
 * */
router.post("/castVote", AuthoriseUser, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId} = req.user;
        const {candidateId} = req.body;
        
        // Todo: Encrypt candidateId
        const encCandidateId = candidateId;
        
        await castVote(userId, encCandidateId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Allows a user to verify their vote
 * */
router.post("/verifyVote", AuthoriseUser, async (req, res) => {
    return Reply(res, 404, "Not Implemented");
});