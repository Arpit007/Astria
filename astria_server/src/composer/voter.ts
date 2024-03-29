/**
 * Created by StarkX on 11-Mar-19.
 */
import { BusinessNetworkConnection } from "composer-client";
import { ResultVote } from "./model";


export async function castVote(voterId: string, voteId: string, encCandidateId: string): Promise<boolean> {
    const namespace = "org.astria.vote";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(voterId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const voteRegistry = await bnc.getAssetRegistry(`${namespace}.Vote`);
    const vote = await voteRegistry.get(voteId);
    
    if (!vote) {
        throw new Error("Invalid Id/Pin");
    }
    
    const castVote = factory.newTransaction(namespace, "CastVote");
    castVote.candidateId = encCandidateId;
    castVote.voteId = voteId;
    
    await bnc.submitTransaction(castVote);
    await bnc.disconnect();
    
    return true;
}


export async function verifyVote(voterId: string, voteId: string, electionId: string): Promise<ResultVote> {
    const namespace = "org.astria.result.ResultVote";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(voterId);
    
    const resultRegistry = await bnc.getAssetRegistry(namespace);
    const resultVoteObj = await resultRegistry.get(voteId);
    
    if (!resultVoteObj) {
        throw new Error("Vote Unavailable");
    }
    
    const {candidateId} = resultVoteObj;
    const resultVote = new ResultVote(voteId, electionId, candidateId);
    
    await bnc.disconnect();
    
    return resultVote;
}