import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { parseDate } from "../../util/misc";
import { Candidate } from "../../composer/model";
import * as AdminComposer from "../../composer/admin";
import { AuthoriseAdmin, CreateAdmin } from "../../lib/authenticate";
import { viewManagers } from "../../composer/allParticipants";
import * as ParticipantComposer from "../../composer/allParticipants";
import { GenerateIdKeys, GenerateVoteKeys } from "../../lib/genUserKeys";

const router: Router = express.Router();
export default router;

router.post("/register", CreateAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        
        await AdminComposer.createAstriaAdmin(userId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Publish the Result of the Election
 * @param auth_token
 * @param voteDecKey
 * */
router.post("/publishResult", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {voteDecKey} = req.body;
        
        await AdminComposer.publishResult(voteDecKey);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Add a manager to the election
 * @param auth_token
 * @param managerId
 * @param electionId
 * */
router.post("/addManager", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {managerId, electionId} = req.body;
        
        await AdminComposer.addElectionManagers(userId, managerId, electionId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Add a new candidate to the election
 * @param auth_token
 * @param candidateName
 * @param logoURI
 * */
router.post("/addCandidate", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId} = req.user;
        const {candidateName, logoURI, electionId} = req.body;
        
        await AdminComposer.createCandidate(userId, candidateName, logoURI, electionId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Modify the Election Dates
 * @param auth_token
 * @param startDate
 * @param endDate
 * @param electionId
 * */
router.post("/modifyDates", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {startDate, endDate, electionId} = req.body;
        
        const startDateParsed = parseDate(startDate, "startDate");
        const endDateParsed = parseDate(endDate, "endDate");
        
        await AdminComposer.modifyElectionDates(userId, startDateParsed, endDateParsed, electionId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Create an Election
 * @param auth_token
 * @param electionName
 * @param startDate
 * @param endDate
 * @param electionId
 * */
router.post("/createElection", AuthoriseAdmin, GenerateIdKeys, async (req: Request, res: Response) => {
    try {
        const {userId, idKey} = req.user;
        const {electionName, startDate, endDate} = req.body;
        
        const startDateParsed = parseDate(startDate, "startDate");
        const endDateParsed = parseDate(endDate, "endDate");
        
        const electionId = await AdminComposer.createElection(userId, electionName, startDateParsed, endDateParsed, idKey);
        
        return Reply(res, 200, {electionId});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Set the Election's Vote decrypt key
 * @param auth_token
 * @param voteDecKey
 * @param electionId
 * */
router.post("/setVoteDecKey", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {voteDecKey, electionId} = req.body;
        
        await AdminComposer.setElectionVoteDecKey(userId, voteDecKey, electionId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Freeze the election
 * @param auth_token
 * @param electionId
 * */
router.post("/freezeElection", AuthoriseAdmin, GenerateVoteKeys, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {voteEncKey, electionId} = req.body;
        
        // Todo: Use Shamir's method
        await AdminComposer.freezeElection(userId, voteEncKey, electionId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Add managers to the election
 * @param auth_token
 * @param managerId
 * @param electionId
 * */
router.post("/addManagers", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {managerId, electionId} = req.body;
        
        await AdminComposer.addElectionManagers(userId, managerId, electionId);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Get list of all the managers
 * @param auth_token
 * @param electionId
 * @returns Manager[]
 * */
router.post("/getManagers", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {electionId} = req.body;
        
        const managersList = await viewManagers(userId, electionId);
        
        return Reply(res, 200, {managersList});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Returns List of Candidates in an Election
 * @param auth_token
 * @param electionId
 * @returns Candidate[]
 * */
router.post("/candidates", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {electionId} = req.body;
        
        const candidates: Candidate[] = await ParticipantComposer.viewCandidates(userId, electionId);
        
        return Reply(res, 200, {candidates});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});