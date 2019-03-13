import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { parseDate } from "../../util/misc";
import * as AdminComposer from "../../composer/admin";
import { AuthoriseUser } from "../../lib/authenticate";
import { GenAdminKeys, GenManagerKeys } from "../../lib/genUserKeys";
import { getManagers } from "../../composer/admin";

const router: Router = express.Router();
export default router;


/**
 * Creates a new admin and generates a corresponding new election
 * @param email
 * @param electionName
 * @param startDate
 * @param endDate
 * @param loginId
 * @returns {adminId, loginId, voteDecKey, loginKey}
 * */
router.post("/create", GenAdminKeys, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {voteKey, idKey, voteDecKey, secret, loginKey} = req.user;
        const {email, electionName, loginId} = req.body;
        let {startDate, endDate} = req.body;
        
        startDate = parseDate(startDate, "startDate");
        endDate = parseDate(endDate, "endDate");
        
        // @ts-ignore
        const adminId = await AdminComposer.createAdmin(voteKey, idKey,
            email, electionName, startDate, endDate, loginId, secret);
        
        // Todo: Remove adminId after auth is implemented
        // @ts-ignore
        return Reply(res, 200, {adminId, loginId, voteDecKey, loginKey});
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
 * @param email
 * @param loginId
 * @returns {adminId, loginId, voteDecKey, loginKey}
 * */
router.post("/addManager", AuthoriseUser, GenManagerKeys, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId, secret, loginKey} = req.user;
        const {email, loginId} = req.body;
        
        const managerId = await AdminComposer.addManager(userId, email, loginId, secret);
        
        // Todo: Remove managerId after auth is implemented
        return Reply(res, 200, {managerId, loginId, loginKey});
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


/**
 * Get list of all the managers
 * @param auth_token
 * @returns Manager[]
 * */
router.post("/getManagers", AuthoriseUser, async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const {userId} = req.user;
        
        const managersList = await getManagers(userId);
        
        return Reply(res, 200, {managersList});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});