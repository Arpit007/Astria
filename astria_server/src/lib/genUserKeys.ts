import express, { NextFunction } from "express";
import { KeyPair } from "../util/security";


export async function GenerateVoteKeys(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    const voteKey = KeyPair.generatePair();
    req.user.voteEncKey = voteKey.publicKey;
    req.user.voteDecKey = voteKey.privateKey;
    return next();
}