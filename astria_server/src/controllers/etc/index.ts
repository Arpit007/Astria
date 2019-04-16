import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { AuthoriseAdmin } from "../../lib/authenticate";
import { Candidate, Election } from "../../composer/model";
import * as ParticipantComposer from "../../composer/allParticipants";

const router: Router = express.Router();
export default router;


/**
 * Returns List of Candidates in an Election
 * @param auth_token
 * @returns Candidate[]
 * */
router.post("/candidates", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId, resourceId} = req.user;
        
        const candidates: Candidate[] = await ParticipantComposer.viewCandidates(userId, resourceId);
        
        return Reply(res, 200, {candidates});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Returns Details about an Election
 * @param electionId
 * @returns Election
 * */
router.post("/election", async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {electionId} = req.body;
        
        const election: Election = await ParticipantComposer.viewElection(electionId);
        
        return Reply(res, 200, {election});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Returns list of all Elections
 * @returns Election[]
 * */
router.post("/allElections", async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const elections: Election[] = await ParticipantComposer.viewAllElections();
        
        return Reply(res, 200, {elections});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Returns Result Summary
 * */
router.post("/resultSummary", async (req: Request, res: Response) => {
    try {
        await ParticipantComposer.resultSummary();
        
        return Reply(res, 404, "Not Implemented");
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Returns detailed Summary
 * */
router.post("/detailedSummary", async (req: Request, res: Response) => {
    try {
        await ParticipantComposer.detailedResultSummary();
        
        return Reply(res, 404, "Not Implemented");
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});