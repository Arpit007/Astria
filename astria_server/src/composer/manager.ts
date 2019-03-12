/**
 * Created by StarkX on 11-Mar-19.
 */

import { BusinessNetworkConnection } from "composer-client";
import { IdCard } from "composer-common";
import { AdminConnection } from "composer-admin";
import connectionProfile from "../../config/profile";

export async function addVoter(managerCardId: string, encVoterId: string): Promise<boolean> {
    const namespace = "org.astria.participant";
    const networkName = "chain_code";
    
    const bnc = new BusinessNetworkConnection();
    await bnc.connect(managerCardId);
    
    const factory = bnc.getBusinessNetwork().getFactory();
    
    const createVoter = factory.newTransaction(namespace, "CreateVoter");
    createVoter.voterId = encVoterId;
    
    await bnc.submitTransaction(createVoter);
    
    const cardName = encVoterId;
    const identity = await bnc.issueIdentity(`${namespace}.AstriaVoter#${encVoterId}`, cardName);
    
    const metadata = {
        userName: identity.userID,
        version: 1,
        enrollmentSecret: identity.userSecret,
        businessNetwork: networkName
    };
    
    const idCard = new IdCard(metadata, connectionProfile);
    
    const managerConnection = new AdminConnection(managerCardId);
    await managerConnection.importCard(cardName, idCard);
    
    await managerConnection.disconnect();
    await bnc.disconnect();
    
    return true;
}