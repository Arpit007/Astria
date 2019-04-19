import crypto from "crypto";
import NodeRSA from "node-rsa";
import constants from "constants";

export class KeyPair {
    public publicKey: string = undefined;
    public privateKey: string = undefined;
    
    public static generatePair() {
        const keyLength = 1024;
        
        const key = new NodeRSA({b: keyLength});
        key.generateKeyPair(keyLength, 65537); // 1024 — key length, 65537 open exponent
        
        const keyPair = new KeyPair();
        keyPair.privateKey = key.exportKey("pkcs1-private");
        keyPair.publicKey = key.exportKey("pkcs1-public");
        
        return keyPair;
    }
}


export function encrypt(message: string, publicKey: string): string {
    const msgBytes = Buffer.from(message);
    const enc = crypto.publicEncrypt({
        key: publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING
    }, msgBytes);
    
    return enc.toString("base64");
}


export function decrypt(encMessage: string, privateKey: string) {
    const msgBytes = Buffer.from(encMessage, "base64");
    const dec = crypto.privateDecrypt({
        key: privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING
    }, msgBytes);
    
    return dec.toString();
}