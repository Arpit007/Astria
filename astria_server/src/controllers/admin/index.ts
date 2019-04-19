import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { parseDate } from "../../util/misc";
import * as AdminComposer from "../../composer/admin";
import { viewManagers } from "../../composer/allParticipants";
import { AstriaAdmin, Candidate } from "../../composer/model";
import * as ParticipantComposer from "../../composer/allParticipants";
import { GenerateIdKeys, GenerateVoteKeys } from "../../lib/genUserKeys";
import { AuthoriseAdmin, CreateAdmin, GetAdminProfile } from "../../lib/authenticate";

const router: Router = express.Router();
export default router;

/**
 * Register a user as AstriaAdmin
 * @param email
 * @param password
 * @param name
 * @param phone
 * */
router.post("/register", CreateAdmin, async (req: Request, res: Response) => {
    try {
        const {auth_token, userId} = req.user;
        
        await AdminComposer.createAstriaAdmin(userId);
        
        return Reply(res, 200, {auth_token, user: {userId}});
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
        // Todo: Not Implemented
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
 * @param electionId
 * @returns candidateId
 * */
router.post("/addCandidate", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {candidateName, logoURI, electionId} = req.body;
        
        const candidateId = await AdminComposer.createCandidate(userId, candidateName, logoURI, electionId);
        
        return Reply(res, 200, {candidateId});
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
 * @returns electionId
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
 * Freeze the election
 * @param auth_token
 * @param electionId
 * */
router.post("/freezeElection", AuthoriseAdmin, GenerateVoteKeys, async (req: Request, res: Response) => {
    try {
        const {userId, voteEncKey} = req.user;
        const {electionId} = req.body;
        
        // Todo: Use Shamir's method, return keys
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
        
        const reqObj = [];
        for (const manager of managersList) {
            reqObj.push(GetAdminProfile(manager.userId));
        }
    
        const reqObjResolved = await Promise.all(reqObj);
        const managers = [];
        for (const managerObj of reqObjResolved) {
            const {userId, email, password, profile} = managerObj;
            const manager = new AstriaAdmin(userId);
            manager.setupProfile(email, password, profile.name, profile.phone);
            managers.push(manager);
        }
        
        return Reply(res, 200, {managers});
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