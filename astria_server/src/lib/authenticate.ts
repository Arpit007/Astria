import express, { NextFunction } from "express";

export async function AuthoriseUser(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    // @ts-ignore
    req["user"] = JSON.parse(req.body.auth_token) || {};
    // Todo: Not Implemented
    return next();
}

