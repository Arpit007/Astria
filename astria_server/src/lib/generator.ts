import crypto from "crypto";
import secrets from "secrets.js-grempe";


export function generateVoterId(userId: string, electionId: string, idKey: string) {
    // Todo: Fix
    const encVoterId = userId + electionId; // encrypt(userId, idKey);
    const voterHashId = crypto.createHash("sha256").update(encVoterId).digest("base64");
    
    return voterHashId;
}


interface SplitKeys {
    adminKey: string;
    managerKeys: string[];
}


const splitMiddle = (key: string) => {
    const index = key.length % 2 ? (key.length / 2 + 1) : (key.length / 2);
    return [key.slice(0, index), key.slice(index)];
};


export function generateSplitKeys(key: string, managerCount: number): SplitKeys {
    const alpha = 0.6;
    const threshold = Math.ceil(managerCount * alpha);
    
    const secretKey = secrets.str2hex(key);
    const [adminKey, managersKey] = splitMiddle(secretKey);
    const result: SplitKeys = {adminKey, managerKeys: []};
    
    if (threshold === 0) {
        return result;
    }
    
    result.managerKeys = secrets.share(managersKey, managerCount, threshold);
    return result;
}

export function combineSplitKeys(adminKey: string, managerKeys: string[]): string {
    const managersKeyPart = secrets.combine(managerKeys);
    const secretKey = adminKey + managersKeyPart;
    return secrets.hex2str(secretKey);
}