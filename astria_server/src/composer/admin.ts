/**
 * Created by StarkX on 11-Mar-19.
 */
import { IdCard } from "composer-common";
import { AdminConnection } from "composer-admin";
import { BusinessNetworkConnection } from "composer-client";

import connectionProfile from "../../config/profile";
import { viewCandidates, viewElection } from "./allParticipants";
import { decrypt, encrypt } from "../util/security";
import { AstriaAdmin, CandidateResult, Election, Result, ResultVote, Vote } from "./model";


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


export async function createAstriaVoter(adminCardId: string, encVoterId: string, encVoteId: string, electionId: string): Promise<boolean> {
    const networkName = "chain_code";
    
    const resource = "AstriaVoter";
    const namespace = "org.astria.participant";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const createVoter = factory.newTransaction(namespace, "CreateAstriaVoter");
    createVoter.userId = encVoterId;
    createVoter.voteId = encVoteId;
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


export async function publishResult(adminId: string, voteDecKey: string, electionId: string) {
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminId);
    
    const resObj = await bnc.query("ElectionsResult", {electionId});
    if (resObj.length > 0) {
        throw new Error("Result already published");
    }
    
    // Pick Election
    const election = await viewElection(electionId);
    const {voteEncKey} = election;
    
    if (adminId !== election.adminId) {
        throw new Error("Unauthorised");
    }
    
    // Check if election is over
    const today = new Date().getTime();
    const endDate = election.endDate.getTime();
    
    if (!election.freeze || today <= endDate) {
        throw new Error("Currently not allowed");
    }
    
    // Check Key Validity
    try {
        const enc = encrypt(electionId, voteEncKey);
        const dec = decrypt(enc, voteDecKey);
        
        if (electionId !== dec) {
            throw new Error("Invalid vote decrypt keys");
        }
    } catch (err) {
        throw new Error("Invalid vote decrypt keys");
    }
    
    // Fetch Candidates
    const candidates = await viewCandidates(electionId);
    const candidateMap: { [key: string]: CandidateResult; } = {};
    for (const candidate of candidates) {
        const {candidateId} = candidate;
        candidateMap[candidateId] = new CandidateResult(candidateId, 0);
    }
    candidates.length = 0; // Free the memory
    
    // Get All Votes
    const votesObj = await bnc.query("AllVotesOfElection", {electionId});
    const votes: Vote[] = [];
    for (const voteObj of votesObj) {
        const {voteId, candidateId, hasVoted} = voteObj;
        const vote = new Vote(voteId, electionId, candidateId, hasVoted);
        votes.push(vote);
    }
    votesObj.length = 0; // Free the memory
    
    // Decrypt each vote
    const resultVotes: ResultVote[] = [];
    for (const vote of votes) {
        const {voteId, candidateId, hasVoted} = vote;
        const recipient = hasVoted ? decrypt(candidateId, voteDecKey) : undefined;
        const resultVote = new ResultVote(voteId, electionId, recipient);
        resultVotes.push(resultVote);
    }
    votes.length = 0; // Free the memory
    
    // Update Vote Map
    for (const vote of resultVotes) {
        const {candidateId} = vote;
        if (candidateId in candidateMap) {
            candidateMap[candidateId].voteCount++;
        }
    }
    
    // Create Result
    const candidateResults: CandidateResult[] = Object.keys(candidateMap).map((v) => candidateMap[v]);
    const result = new Result(electionId, candidateResults);
    
    // Add Result Vote to Chain
    const resultNamespace = "org.astria.result";
    const resultVoteResource = "ResultVote";
    
    const factory = bnc.getBusinessNetwork().getFactory();
    const resultVoteRegistry = await bnc.getAssetRegistry(`${resultNamespace}.${resultVoteResource}`);
    const voteReqObjs: Promise<any>[] = [];
    
    for (const vote of resultVotes) {
        const {voteId, candidateId} = vote;
        const resultVote = factory.newResource(resultNamespace, resultVoteResource, voteId);
        resultVote.candidateId = candidateId;
        resultVote.electionId = electionId;
        voteReqObjs.push(resultVoteRegistry.add(resultVote));
    }
    await Promise.all(voteReqObjs);
    
    // Add Result to Chain
    const resultResource = "Result";
    const candidateResultResource = "CandidateResult";
    
    const resultObj = factory.newResource(resultNamespace, resultResource, electionId);
    resultObj.results = [];
    for (const candidateResult of result.results) {
        const {candidate, voteCount} = candidateResult;
        const candidateResultObj = factory.newConcept(resultNamespace, candidateResultResource);
        
        candidateResultObj.candidateId = candidate;
        candidateResultObj.voteCount = voteCount;
        resultObj.addArrayValue("results", candidateResultObj);
    }
    const resultRegistry = await bnc.getAssetRegistry(`${resultNamespace}.${resultResource}`);
    await resultRegistry.add(resultObj);
    
    await setElectionVoteDecKey(adminId, voteDecKey, electionId);
    
    return true;
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


export async function getElectionByAdmin(adminCardId: string) {
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const electionsObj = await bnc.query("ElectionsByAdminId", {adminId: adminCardId});
    
    const electionList: Election[] = [];
    
    for (const electionObj of electionsObj) {
        const {electionId, electionName, startDate, endDate, idKey, voteEncKey, voteDecKey, freeze, adminId, managers} = electionObj;
        const election = new Election(electionId, electionName, startDate, endDate, idKey, voteEncKey, voteDecKey, freeze, adminId, managers);
        electionList.push(election);
    }
    
    await bnc.disconnect();
    
    return electionList;
}