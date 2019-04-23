import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { parseDate } from "../../util/misc";
import { AstriaAdmin } from "../../composer/model";
import * as AdminComposer from "../../composer/admin";
import { GenerateVoteKeys } from "../../lib/genUserKeys";
import { combineSplitKeys, generateSplitKeys } from "../../lib/generator";
import { viewElection, viewManagers } from "../../composer/allParticipants";
import { AuthoriseAdmin, CreateAdmin, GetAdminProfile } from "../../lib/authenticate";
import { getElectionByAdmin } from "../../composer/admin";

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
 * @param electionId
 * @param adminKey
 * @param managerKeys[]
 * */
router.post("/publishResult", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {adminKey, managerKeys, electionId} = req.body;
        const voteDecKey = combineSplitKeys(adminKey, managerKeys);
        
        await AdminComposer.publishResult(userId, voteDecKey, electionId);
        
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
router.post("/createElection", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        const {electionName, startDate, endDate} = req.body;
        
        const startDateParsed = parseDate(startDate, "startDate");
        const endDateParsed = parseDate(endDate, "endDate");
        
        const electionId = await AdminComposer.createElection(userId, electionName, startDateParsed, endDateParsed);
        
        return Reply(res, 200, {electionId});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Freeze the election
 * @param auth_token
 * @param electionId
 * @returns {adminKey, managerKeys[]}
 * */
router.post("/freezeElection", AuthoriseAdmin, GenerateVoteKeys, async (req: Request, res: Response) => {
    try {
        const {userId, voteEncKey, voteDecKey} = req.user;
        const {electionId} = req.body;
        
        await AdminComposer.freezeElection(userId, voteEncKey, electionId);
        
        const election = await viewElection(electionId);
        const keys = generateSplitKeys(voteDecKey, election.managers.length);
        
        return Reply(res, 200, {...keys});
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
 * Get list of all the elections by an Admin
 * @param auth_token
 * @returns Election[]
 * */
router.post("/getElectionByAdmin", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        
        const electionList = await getElectionByAdmin(userId);
        
        return Reply(res, 200, {elections: electionList});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Get Profile
 * @param auth_token
 * @returns AstriaAdmin
 * */
router.post("/profile", AuthoriseAdmin, async (req: Request, res: Response) => {
    try {
        const {userId} = req.user;
        
        const admin = await GetAdminProfile(userId);
        
        return Reply(res, 200, {admin});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});