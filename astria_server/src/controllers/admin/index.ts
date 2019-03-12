import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { parseDate } from "../../util/misc";
import * as AdminComposer from "../../composer/admin";
import { AuthoriseUser, GenAdminKeys } from "../../lib/authenticate";

const router: Router = express.Router();
export default router;


/**
 * Creates a new admin and generates a corresponding new election
 * @param email
 * @param electionName
 * @param startDate
 * @param endDate
 * @returns {adminId, voteDecKey}
 * */
router.post("/create", GenAdminKeys, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {voteKey, idKey, voteDecKey} = req.user;
        const {email, electionName} = req.body;
        let {startDate, endDate} = req.body;
        
        startDate = parseDate(startDate, "startDate");
        endDate = parseDate(endDate, "endDate");
        
        // @ts-ignore
        const adminId = await AdminComposer.createAdmin(voteKey, idKey, email, electionName, startDate, endDate);
        
        // @ts-ignore
        return Reply(res, 200, {adminId, voteDecKey});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Publish the Result of the Election
 * @param auth_token
 * @param voteDecKey
 * */
router.post("/publishResult", AuthoriseUser, async (req: Request, res: Response) => {
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
 * @returns managerId
 * */
router.post("/addManager", AuthoriseUser, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId} = req.user;
        const {email} = req.body;
        
        // Todo: How will manager Login
        const managerId = await AdminComposer.addManager(userId, email);
        
        return Reply(res, 200, {managerId});
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
router.post("/addCandidate", AuthoriseUser, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId} = req.user;
        const {candidateName, logoURI} = req.body;
        
        await AdminComposer.addCandidate(userId, candidateName, logoURI);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Update the Election Dates
 * @param auth_token
 * @param startDate
 * @param endDate
 * */
router.post("/update", AuthoriseUser, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId} = req.user;
        let {startDate, endDate} = req.body;
        
        startDate = parseDate(startDate, "startDate");
        endDate = parseDate(endDate, "endDate");
        
        // @ts-ignore
        await AdminComposer.updateElection(userId, startDate, endDate);
        
        return Reply(res, 200, {});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});