/**
 * Created by StarkX on 11-Mar-19.
 */
import { IdCard } from "composer-common";
import { AdminConnection } from "composer-admin";
import { BusinessNetworkConnection } from "composer-client";

import connectionProfile from "../../config/profile";
import { viewCandidates, viewElection } from "./allParticipants";
import { decrypt, encrypt } from "../util/security";
import { CandidateResult } from "./model";


export async function createAstriaAdmin(adminId: string): Promise<boolean> {
    const networkName = "chain_code";
    
    const resource = "AstriaAdmin";
    const namespace = "org.astria.participant";
    const networkAdminId = "admin@chain_code";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(networkAdminId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const createAdmin = factory.newTransaction(namespace, "CreateAstriaAdmin");
    createAdmin.userId = adminId;
    
    await bnc.submitTransaction(createAdmin);
    
    const cardName = adminId;
    const options = {issuer: true};
    const identity = await bnc.issueIdentity(`${namespace}.${resource}#${adminId}`, cardName, options);
    
    const metadata = {
        userName: identity.userID,
        version: 1,
        enrollmentSecret: identity.userSecret,
        businessNetwork: networkName
    };
    
    const idCard = new IdCard(metadata, connectionProfile);
    
    const adminConnection = new AdminConnection(networkAdminId);
    await adminConnection.importCard(cardName, idCard);
    
    await adminConnection.disconnect();
    await bnc.disconnect();
    
    return true;
}


export async function createAstriaVoter(adminCardId: string, encVoterId: string, electionId: string): Promise<boolean> {
    const networkName = "chain_code";
    
    const resource = "AstriaVoter";
    const namespace = "org.astria.participant";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const createVoter = factory.newTransaction(namespace, "CreateAstriaVoter");
    createVoter.userId = encVoterId;
    createVoter.electionId = electionId;
    
    await bnc.submitTransaction(createVoter);
    
    const cardName = encVoterId;
    const identity = await bnc.issueIdentity(`${namespace}.${resource}#${encVoterId}`, cardName);
    
    const metadata = {
        userName: identity.userID,
        version: 1,
        enrollmentSecret: identity.userSecret,
        businessNetwork: networkName
    };
    
    const idCard = new IdCard(metadata, connectionProfile);
    
    const managerConnection = new AdminConnection(adminCardId);
    await managerConnection.importCard(cardName, idCard);
    
    await managerConnection.disconnect();
    await bnc.disconnect();
    
    return true;
}


export async function createElection(adminCardId: string, electionName: string, startDate: Date, endDate: Date): Promise<string> {
    const namespace = "org.astria.election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const createElection = factory.newTransaction(namespace, "CreateElection");
    createElection.electionName = electionName;
    createElection.startDate = startDate;
    createElection.endDate = endDate;
    
    const electionId = await bnc.submitTransaction(createElection);
    
    await bnc.disconnect();
    
    return electionId;
}


export async function modifyElectionDates(adminCardId: string, startDate: Date, endDate: Date, electionId: string): Promise<boolean> {
    const namespace = "org.astria.election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const updateElection = factory.newTransaction(namespace, "ModifyElectionDates");
    updateElection.startDate = startDate;
    updateElection.endDate = endDate;
    updateElection.electionId = electionId;
    
    await bnc.submitTransaction(updateElection);
    await bnc.disconnect();
    
    return true;
}


export async function setElectionVoteDecKey(adminCardId: string, voteDecKey: string, electionId: string): Promise<boolean> {
    const namespace = "org.astria.election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const updateElection = factory.newTransaction(namespace, "SetElectionVoteDecKey");
    updateElection.voteDecKey = voteDecKey;
    updateElection.electionId = electionId;
    
    await bnc.submitTransaction(updateElection);
    await bnc.disconnect();
    
    return true;
}


export async function freezeElection(adminCardId: string, voteEncKey: string, electionId: string): Promise<boolean> {
    const namespace = "org.astria.election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const updateElection = factory.newTransaction(namespace, "FreezeElection");
    updateElection.voteEncKey = voteEncKey;
    updateElection.electionId = electionId;
    
    await bnc.submitTransaction(updateElection);
    await bnc.disconnect();
    
    return true;
}


export async function addElectionManagers(adminCardId: string, managerId: string, electionId: string): Promise<boolean> {
    const namespace = "org.astria.election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const updateElection = factory.newTransaction(namespace, "AddElectionManagers");
    updateElection.managerId = managerId;
    updateElection.electionId = electionId;
    
    await bnc.submitTransaction(updateElection);
    await bnc.disconnect();
    
    return true;
}


export async function publishResult(adminCardId: string, voteDecKey: string, electionId: string) {
    // Todo: Not Implemented
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const election = await viewElection(electionId);
    
    const today = new Date().getTime();
    const endDate = election.endDate.getTime();
    
    if (!election.freeze || today >= endDate) {
        throw new Error("Currently not allowed");
    }
    
    try {
        const enc = encrypt(election.electionId, election.voteEncKey);
        const dec = decrypt(enc, voteDecKey);
        if (enc !== dec) {
            throw new Error("Invalid vote decrypt keys");
        }
    } catch (err) {
        throw new Error("Invalid vote decrypt keys");
    }
    
    const candidates = await viewCandidates(electionId);
    const candidatesResult = {};
    for (const candidate of candidates) {
        const {candidateId} = candidate;
        // candidatesResult[candidateId] = new CandidateResult(candidateId, 0);
    }
    
    const votes = await bnc.query("AllVotesOfElection", {electionId});
    for (const vote of votes) {
    
    }
}


export async function createCandidate(adminCardId: string, candidateName: string, logoURI: string, electionId: string): Promise<string> {
    const namespace = "org.astria.candidate";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const createCandidate = factory.newTransaction(namespace, "CreateCandidate");
    createCandidate.candidateName = candidateName;
    createCandidate.logoURI = logoURI;
    createCandidate.electionId = electionId;
    
    const candidateId = await bnc.submitTransaction(createCandidate);
    await bnc.disconnect();
    
    return candidateId;
}