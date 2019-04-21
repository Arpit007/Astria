import crypto from "crypto";
import NodeRSA from "node-rsa";
import constants from "constants";

export class KeyPair {
    public publicKey: string = undefined;
    public privateKey: string = undefined;
    
    public static generatePair() {
        const keyLength = 2048;
        
        const key = new NodeRSA({b: keyLength});
        key.generateKeyPair(keyLength, 65537); // 2048 — key length, 65537 open exponent
        
        const keyPair = new KeyPair();
        keyPair.privateKey = key.exportKey("pkcs8-private-der").toString("base64");
        keyPair.publicKey = key.exportKey("pkcs8-public-der").toString("base64");
        
        return keyPair;
    }
}


export function encrypt(message: string, publicKey: string): string {
    const usePubKey = new NodeRSA()
        .importKey(Buffer.from(publicKey, "base64"), "pkcs8-public-der")
        .exportKey("pkcs8-public-pem");
    
    const msgBytes = Buffer.from(message);
    const enc = crypto.publicEncrypt({
        key: usePubKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING
    }, msgBytes);
    
    return enc.toString("base64");
}


export function decrypt(encMessage: string, privateKey: string) {
    const usePvtKey = new NodeRSA()
        .importKey(Buffer.from(privateKey, "base64"), "pkcs8-private-der")
        .exportKey("pkcs8-private-pem");
    
    const msgBytes = Buffer.from(encMessage, "base64");
    const dec = crypto.privateDecrypt({
        key: usePvtKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING
    }, msgBytes);
    
    return dec.toString();
}