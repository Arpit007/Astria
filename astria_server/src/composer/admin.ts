/**
 * Created by StarkX on 11-Mar-19.
 */
import { IdCard } from "composer-common";
import { AdminConnection } from "composer-admin";
import { BusinessNetworkConnection } from "composer-client";

import connectionProfile from "../../config/profile";


export async function createAdmin(voteKey: string, idKey: string, email: string,
                                  electionName: string, startDate: Date, endDate: Date): Promise<string> {
    const networkAdminId = "admin@chain_code";
    const namespace = "org.astria.participant";
    const networkName = "chain_code";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(networkAdminId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const createAdmin = factory.newTransaction(namespace, "CreateAdmin");
    createAdmin.voteKey = voteKey;
    createAdmin.idKey = idKey;
    createAdmin.email = email;
    createAdmin.electionName = electionName;
    createAdmin.startDate = startDate;
    createAdmin.endDate = endDate;
    
    const adminId = await bnc.submitTransaction(createAdmin);
    
    const cardName = adminId;
    const options = {issuer: true};
    const identity = await bnc.issueIdentity(`${namespace}.AstriaAdmin#${adminId}`, cardName, options);
    
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
    
    return adminId;
}


export async function updateElection(adminCardId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const namespace = "org.astria.election";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const updateElection = factory.newTransaction(namespace, "UpdateElection");
    updateElection.startDate = startDate;
    updateElection.endDate = endDate;
    
    await bnc.submitTransaction(updateElection);
    await bnc.disconnect();
    
    return true;
}


export async function publishResult(voteDecKey: string) {
    // Todo: Not Implemented
}


export async function addManager(adminCardId: string, email: string): Promise<string> {
    const namespace = "org.astria.participant";
    const networkName = "chain_code";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const createManager = factory.newTransaction(namespace, "CreateManager");
    createManager.email = email;
    
    const managerId = await bnc.submitTransaction(createManager);
    
    const cardName = managerId;
    const options = { issuer : true };
    const identity = await bnc.issueIdentity(`${namespace}.AstriaManager#${managerId}`, cardName, options);
    
    const metadata = {
        userName : identity.userID,
        version : 1,
        enrollmentSecret : identity.userSecret,
        businessNetwork : networkName
    };
    
    const idCard = new IdCard(metadata, connectionProfile);
    
    const adminConnection = new AdminConnection(adminCardId);
    await adminConnection.importCard(cardName, idCard);
    
    await adminConnection.disconnect();
    await bnc.disconnect();
    
    return managerId;
}


export async function addCandidate(adminCardId: string, candidateName: string, logoURI: string): Promise<boolean> {
    const namespace = "org.astria.candidate";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(adminCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const createCandidate = factory.newTransaction(namespace, "CreateCandidate");
    createCandidate.candidateName = candidateName;
    createCandidate.logoURI = logoURI;
    
    await bnc.submitTransaction(createCandidate);
    await bnc.disconnect();
    
    return true;
}