/**
 * Created by StarkX on 11-Mar-19.
 */
import { BusinessNetworkConnection } from "composer-client";

export async function castVote(voterId: string, encCandidateId: string): Promise<boolean> {
    const namespace = "org.astria.vote";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(voterId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const castVote = factory.newTransaction(namespace, "CastVote");
    castVote.candidateId = encCandidateId;
    
    await bnc.submitTransaction(castVote);
    await bnc.disconnect();
    
    return true;
}


export async function verifyVote() {
}