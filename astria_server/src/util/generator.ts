import crypto from "crypto";

export function generateVoterId(userId: string, idKey: string) {
    // Todo: Fix
    const encVoterId = userId; // encrypt(userId, idKey);
    const voterHashId = crypto.createHash("sha256").update(encVoterId).digest("base64");
    
    return voterHashId;
}