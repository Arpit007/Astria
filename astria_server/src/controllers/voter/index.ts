import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { encrypt } from "../../util/security";
import { castVote, verifyVote } from "../../composer/voter";
import { generateVoterIdFromPin } from "../../lib/generator";
import { AuthoriseVoter } from "../../lib/authenticate";
import { viewElection } from "../../composer/allParticipants";

const router: Router = express.Router();
export default router;


/**
 * Allows a voter to cast the vote
 * @param userId
 * @param pin
 * @param candidateId
 * @param electionId
 * */
router.post("/castVote", AuthoriseVoter, async (req: Request, res: Response) => {
    try {
        const {userId, pin} = req.user;
        const {candidateId, electionId} = req.body;
        
        const election = await viewElection(electionId);
        const voterId = generateVoterIdFromPin(userId, electionId, pin);
        const encCandidateId = encrypt(candidateId, election.voteEncKey);
        
        await castVote(voterId, encCandidateId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Allows a user to verify their vote
 * @param userId
 * @param pin
 * @param electionId
 * @returns ResultVote
 * */
router.post("/verifyVote", AuthoriseVoter, async (req, res) => {
    try {
        const {userId, pin} = req.user;
        const {electionId} = req.body;
        
        const voterId = generateVoterIdFromPin(userId, electionId, pin);
        const vote = await verifyVote(voterId, electionId);
        
        return Reply(res, 200, {vote});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});