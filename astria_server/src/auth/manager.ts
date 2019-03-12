import express, { NextFunction } from "express";

export function AuthoriseManager(req: express.Request, res: express.Response, next: NextFunction): void {
    // @ts-ignore
    req["user"] = {
        userId: req.body.userId,
        resourceId: "AstriaAdmin"
    };
    
    return next();
}