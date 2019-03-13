import express, { NextFunction } from "express";
import { encrypt, KeyPair } from "../util/security";

export async function GenAdminKeys(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    const voteKey = KeyPair.generatePair();
    const idKey = KeyPair.generatePair();
    const loginKey = KeyPair.generatePair();
    
    const {loginId} = req.body;
    const secret = encrypt(loginId, loginKey.publicKey);
    
    /*
    * Todo: 1. Generate Auth Token from Auth Sever
    * */
    
    // @ts-ignore
    req["user"] = {
        resourceId: "AstriaAdmin",
        voteKey: voteKey.publicKey,
        voteDecKey: voteKey.privateKey,
        idKey: idKey.publicKey,
        loginKey: loginKey.privateKey,
        secret
    };
    
    return next();
}

export async function GenManagerKeys(req: express.Request, res: express.Response, next: NextFunction): Promise<void> {
    const loginKey = KeyPair.generatePair();
    
    const {loginId} = req.body;
    const secret = encrypt(loginId, loginKey.publicKey);
    
    // @ts-ignore
    req["user"] = {
        // @ts-ignore
        ...req.user,
        resourceId: "AstriaManager",
        loginKey: loginKey.privateKey,
        secret
    };
    
    return next();
}