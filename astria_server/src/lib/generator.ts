import crypto from "crypto";
import * as securePin from "secure-pin";
import secrets from "secrets.js-grempe";
import { PIN_LENGTH } from "../util/secrets";

interface VoterId {
    voterId: string;
    pin: string;
}

export function generateVoterId(userId: string, electionId: string, pin?: string): VoterId {
    const usePin = pin ? pin : securePin.generatePinSync(PIN_LENGTH);
    const voterId = `${userId}${electionId}${usePin}`;
    const encVoterId = crypto.createHash("sha256").update(voterId).digest("base64");
    return {pin: usePin, voterId: encVoterId};
}

export function generateVoterIdFromPin(userId: string, electionId: string, pin: string): string {
    const voterId = `${userId}${electionId}${pin}`;
    return crypto.createHash("sha256").update(voterId).digest("base64");
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
        result.adminKey = key;
        return result;
    }
    
    result.managerKeys = secrets.share(managersKey, managerCount, threshold);
    return result;
}

export function combineSplitKeys(adminKey: string, managerKeys: string[]): string {
    if (managerKeys.length === 0) {
        // Todo: Remove
        // return adminKey;
        return secrets.hex2str(adminKey);
    }
    
    const managersKeyPart = secrets.combine(managerKeys);
    const secretKey = adminKey + managersKeyPart;
    return secrets.hex2str(secretKey);
}