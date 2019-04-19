import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { encrypt } from "../../util/security";
import { castVote } from "../../composer/voter";
import { Candidate } from "../../composer/model";
import { AuthoriseVoter } from "../../lib/authenticate";
import { viewElection } from "../../composer/allParticipants";
import * as ParticipantComposer from "../../composer/allParticipants";

const router: Router = express.Router();
export default router;


/**
 * Allows a voter to cast the vote
 * @param auth_token
 * @param candidateId
 * @param electionId
 * */
router.post("/castVote", AuthoriseVoter, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {candidateId, electionId} = req.body;
        
        const election = await viewElection(electionId);
        const encCandidateId = encrypt(candidateId, election.voteEncKey);
        
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


/**
 * Returns List of Candidates in an Election
 * @param auth_token
 * @param electionId
 * @returns Candidate[]
 * */
router.post("/candidates", AuthoriseVoter, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {electionId} = req.body;
        
        const candidates: Candidate[] = await ParticipantComposer.viewCandidates(userId, electionId);
        
        return Reply(res, 200, {candidates});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});