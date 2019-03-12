import express, { NextFunction } from "express";

export async function AuthoriseUser(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    // @ts-ignore
    req["user"] = JSON.parse(req.body.auth_token) || {};
    // Todo: Not Implemented
    return next();
}

export async function GenAdminKeys(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    // @ts-ignore
    req["user"] = {
        userId: new Date().toISOString(),
        resourceId: "AstriaAdmin",
        voteKey: "Vote Pub Key",
        voteDecKey: "Vote Pvt Key",
        idKey: "Some ID Key"
    };
    // Todo: Not Implemented
    return next();
}