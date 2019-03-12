import express, { Request, Response, Router } from "express";

import Reply from "../../util/Reply";
import { AuthoriseAdmin } from "../../auth/admin";
import { AuthoriseManager } from "../../auth/manager";
import { AuthoriseVoter } from "../../auth/voter";
import { Candidate, Election } from "../../composer/model";
import * as ParticipantComposer from "../../composer/allParticipants";

const router: Router = express.Router();
export default router;

function getAuthMethod(resourceId: string): any {
    let authMethod: any = undefined;
    
    switch (resourceId) {
        case "AstriaAdmin":
            authMethod = AuthoriseAdmin;
            break;
        case "AstriaManager":
            authMethod = AuthoriseManager;
            break;
        case "AstriaVoter":
            authMethod = AuthoriseVoter;
            break;
    }
    
    return authMethod;
}

router.post("/candidates", (req: Request, res: Response) => {
    const resourceId = req.body.resourceId;
    const authMethod: any = getAuthMethod(resourceId);
    
    if (!authMethod) {
        return Reply(res, 400, "Invalid resourceID");
    }
    
    return authMethod(req, res, async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const candidates: Candidate[] = await ParticipantComposer.viewCandidates(req.user.userId, req.user.resourceId);
            
            return Reply(res, 200, {candidates});
        } catch (err) {
            return Reply(res, 400, err.message);
        }
    });
});

router.post("/election", (req: Request, res: Response) => {
    const resourceId = req.body.resourceId;
    const authMethod: any = getAuthMethod(resourceId);
    
    if (!authMethod) {
        return Reply(res, 400, "Invalid resourceID");
    }
    
    return authMethod(req, res, async (req: Request, res: Response) => {
        try {
            // @ts-ignore
            const election: Election = await ParticipantComposer.viewElection(req.user.userId, req.user.resourceId);
            
            return Reply(res, 200, {election});
        } catch (err) {
            return Reply(res, 400, err.message);
        }
    });
});

router.post("/allElections", (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const elections: Election[] = await ParticipantComposer.viewAllElections();
        
        return Reply(res, 200, {elections});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});

router.post("/resultSummary", async (req: Request, res: Response) => {
    try {
        await ParticipantComposer.resultSummary();
        
        return Reply(res, 400, "Not Implemented");
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});

router.post("/detailedSummary", async (req: Request, res: Response) => {
    try {
        await ParticipantComposer.detailedResultSummary();
        
        return Reply(res, 400, "Not Implemented");
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});