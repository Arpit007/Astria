import express, { Request, Response, Router } from "express";

import Reply from "../../util/reply";
import { AstriaAdmin, Election } from "../../composer/model";
import * as ParticipantComposer from "../../composer/allParticipants";
import { GetAdminProfile } from "../../lib/authenticate";

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


/**
 * Returns list of all Admins
 * @returns AstriaAdmin[]
 * */
router.post("/allAdmins", async (req: Request, res: Response) => {
    try {
        // Todo: Fetch Profile
        const admins: AstriaAdmin[] = await ParticipantComposer.viewAllAdmins();
        
        return Reply(res, 200, {admins});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


/**
 * Get election admin
 * @returns AstriaAdmin
 * */
router.post("/getAdmin", async (req: Request, res: Response) => {
    try {
        const {electionId} = req.body;
        const admin: AstriaAdmin = await ParticipantComposer.getElectionAdmin(electionId);
        const adminProfile = GetAdminProfile(admin.userId);
        
        return Reply(res, 200, {admin: adminProfile});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});