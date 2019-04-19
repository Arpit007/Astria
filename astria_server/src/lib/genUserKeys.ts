import express, { NextFunction } from "express";
import { KeyPair } from "../util/security";


export async function GenerateIdKeys(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    const idKey = KeyPair.generatePair();
    req.user.idKey = idKey.publicKey;
    return next();
}


export async function GenerateVoteKeys(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    const voteKey = KeyPair.generatePair();
    req.user.voteEncKey = voteKey.publicKey;
    req.user.voteDecKey = voteKey.privateKey;
    return next();
}