/**
 * Created by StarkX on 11-Mar-19.
 */
import { BusinessNetworkConnection } from "composer-client";

import { AstriaAdmin, Candidate, Election } from "./model";


export async function viewCandidates(userCardId: string, electionId: string): Promise<Candidate[]> {
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(userCardId);
    
    const candidatesObj = await bnc.query("CandidatesByElectionId", {electionId});
    
    const candidateList: Candidate[] = [];
    
    for (const candidateObj of candidatesObj) {
        const {candidateId, candidateName, logoURI} = candidateObj;
        const candidate = new Candidate(candidateId, candidateName,
            logoURI, electionId);
        candidateList.push(candidate);
    }
    
    await bnc.disconnect();
    
    return candidateList;
}


export async function viewElection(electionId: string): Promise<Election> {
    const adminCardId = "admin@chain_code";
    const namespace = "org.astria.election.Election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const electionRegistry = await bnc.getAssetRegistry(namespace);
    const electionObj = await electionRegistry.get(electionId);
    
    if (!electionObj) {
        throw new Error("Invalid electionId");
    }
    
    const {electionName, startDate, endDate, idKey, voteEncKey, voteDecKey, freeze, adminId, managers} = electionObj;
    
    const election = new Election(electionId, electionName, startDate, endDate, idKey, voteEncKey, voteDecKey, freeze, adminId, managers);
    
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
        const {electionId, electionName, startDate, endDate, idKey, voteEncKey, voteDecKey, freeze, adminId, managers} = electionObj;
        const election = new Election(electionId, electionName, startDate, endDate, idKey, voteEncKey, voteDecKey, freeze, adminId, managers);
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


export async function getElectionAdmin(electionId: string): Promise<AstriaAdmin> {
    const userCardId = "admin@chain_code";
    const namespace = "org.astria.participant.AstriaAdmin";
    const electionNamespace = "org.astria.election.Election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(userCardId);
    
    const electionRegistry = await bnc.getAssetRegistry(electionNamespace);
    const election = await electionRegistry.get(electionId);
    
    if (!election) {
        throw new Error("Invalid electionId");
    }
    
    const {adminId} = election;
    
    const participantRegistry = await bnc.getParticipantRegistry(namespace);
    
    // To fetch additional fields, if added in future
    const adminObj = await participantRegistry.get(adminId);
    const admin: AstriaAdmin = new AstriaAdmin(adminObj.userId);
    
    await bnc.disconnect();
    
    return admin;
}


export async function viewAllAdmins(): Promise<AstriaAdmin[]> {
    const adminId = "admin@chain_code";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminId);
    
    const adminsObj = await bnc.query("AllAstriaAdmins");
    
    const adminList: AstriaAdmin[] = [];
    
    for (const adminObj of adminsObj) {
        const {userId} = adminObj;
        const admin: AstriaAdmin = new AstriaAdmin(userId);
        adminList.push(admin);
    }
    
    await bnc.disconnect();
    
    return adminList;
}


export async function viewManagers(userCardId: string, electionId: string): Promise<AstriaAdmin[]> {
    const namespace = "org.astria.participant.AstriaAdmin";
    const electionNamespace = "org.astria.election.Election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(userCardId);
    
    const electionRegistry = await bnc.getAssetRegistry(electionNamespace);
    const election = await electionRegistry.get(electionId);
    
    if (!election) {
        throw new Error("Invalid electionId");
    }
    
    const participantRegistry = await bnc.getParticipantRegistry(namespace);
    const managersObjPromise = [];
    
    for (const userId of election.managers) {
        managersObjPromise.push(participantRegistry.get(userId));
    }
    
    const managersObj = await Promise.all(managersObjPromise);
    
    const managersList: AstriaAdmin[] = [];
    for (const managerObj of managersObj) {
        const {userId} = managerObj;
        const manager: AstriaAdmin = new AstriaAdmin(userId);
        managersList.push(manager);
    }
    
    await bnc.disconnect();
    
    return managersList;
}