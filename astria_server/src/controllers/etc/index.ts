import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { GetAdminProfile } from "../../lib/authenticate";
import { AstriaAdmin, Election } from "../../composer/model";
import * as ParticipantComposer from "../../composer/allParticipants";

const router: Router = express.Router();
export default router;

/**
 * Returns Details about an Election
 * @param electionId
 * @returns Election
 * */
router.post("/election", async (req: Request, res: Response) => {
    try {
        const {electionId} = req.body;
        
        const election: Election = await ParticipantComposer.viewElection(electionId);
        election.admin = await GetAdminProfile(election.adminId);
        
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
        const {electionId} = req.body;
        
        const result = await ParticipantComposer.resultSummary(electionId);
        
        return Reply(res, 200, {result});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Returns list of all Admins
 * @returns AstriaAdmin[]
 * */
router.post("/allAdmins", async (req: Request, res: Response) => {
    try {
        let admins: AstriaAdmin[] = await ParticipantComposer.viewAllAdmins();
        const reqObj = [];
        
        for (const admin of admins) {
            reqObj.push(GetAdminProfile(admin.userId));
        }
        
        const reqObjResolved = await Promise.all(reqObj);
        admins = [];
        for (const adminObj of reqObjResolved) {
            const {userId, email, password, profile} = adminObj;
            const admin = new AstriaAdmin(userId);
            admin.setupProfile(email, password, profile.name, profile.phone);
            admins.push(admin);
        }
        
        return Reply(res, 200, {admins});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Get election admin
 * @param electionId
 * @returns AstriaAdmin
 * */
router.post("/getAdmin", async (req: Request, res: Response) => {
    try {
        const {electionId} = req.body;
        const admin: AstriaAdmin = await ParticipantComposer.getElectionAdmin(electionId);
        const adminProfile = await GetAdminProfile(admin.userId);
        
        return Reply(res, 200, {admin: adminProfile});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});