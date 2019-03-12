/**
 * Created by StarkX on 11-Mar-19.
 */

import { BusinessNetworkConnection } from "composer-client";
import { Candidate, Election } from "./model";

export async function viewCandidates(userCardId: string, resourceId: string): Promise<Candidate[]> {
    const namespace = "org.astria.participant";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(userCardId);
    
    const participantRegistry = await bnc.getParticipantRegistry(`${namespace}.${resourceId}`);
    const user = await participantRegistry.get(userCardId);
    
    const electionId = user.electionId;
    
    const candidatesObj = await bnc.query("CandidateByElectionId", {electionId});
    
    const candidateList: Candidate[] = [];
    
    for (const candidateObj of candidatesObj) {
        const candidate = new Candidate(candidateObj.candidateId, candidateObj.candidateName,
            candidateObj.logoURI, candidateObj.electionId);
        candidateList.push(candidate);
    }
    
    await bnc.disconnect();
    
    return candidateList;
}


export async function viewElection(electionId: string): Promise<Election> {
    const adminId = "admin@chain_code";
    const namespace = "org.astria.election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminId);
    
    const electionRegistry = await bnc.getAssetRegistry(namespace);
    const electionObj = await electionRegistry.get(electionId);
    
    const election = new Election(electionObj.electionId, electionObj.electionName,
        electionObj.startDate, electionObj.endDate, electionObj.adminId);
    
    await bnc.disconnect();
    
    return election;
}


export async function viewAllElections(): Promise<Election[]> {
    const adminId = "admin@chain_code";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminId);
    
    const electionsObj = await bnc.query("AllElections");
    
    const electionList: Election[] = [];
    
    for (const electionObj of electionsObj) {
        const election = new Election(electionObj.electionId, electionObj.electionName,
            electionObj.startDate, electionObj.endDate, electionObj.adminId);
        electionList.push(election);
    }
    
    await bnc.disconnect();
    
    return electionList;
}


export async function resultSummary() {
    // Todo: Not Implemented
}


export async function detailedResultSummary() {
    // Todo: Not Implemented
}