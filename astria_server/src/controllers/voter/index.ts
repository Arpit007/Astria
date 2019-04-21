import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { encrypt } from "../../util/security";
import { AuthoriseVoter } from "../../lib/authenticate";
import { castVote, verifyVote } from "../../composer/voter";
import { viewElection } from "../../composer/allParticipants";
import { generateVoteId, generateVoterId } from "../../lib/generator";

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
        
        const today = new Date().getTime();
        const startDate = election.startDate.getTime();
        const endDate = election.endDate.getTime();
        
        if (!election.freeze || today < startDate || today > endDate) {
            return Reply(res, 400, "Can't vote now");
        }
    
        const voterId = generateVoterId(userId, electionId);
        const voteId = generateVoteId(userId, electionId, pin);
        const encCandidateId = encrypt(candidateId, election.voteEncKey);
        
        await castVote(voterId, voteId, encCandidateId);
        
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
        // Todo: Verify
        const {userId, pin} = req.user;
        const {electionId} = req.body;
        
        // const voterId = generateVoterId(userId, electionId);
        const voteId = generateVoteId(userId, electionId, pin);
        const voterId = voteId;
        const vote = await verifyVote(voterId, voteId, electionId);
        
        return Reply(res, 200, {vote});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});