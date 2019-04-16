"use strict";


function generateId(upperId, middleId, lowerId) {
	return sha256(`${upperId}-${middleId}-${lowerId}`);
}

/**
 * Create AstriaAdmin
 * @param {org.astria.participant.CreateAstriaAdmin} adminData The admin to be created.
 * @transaction
 * */
async function createAdmin(adminData) {
	const adminNamespace = "org.astria.participant";
	const adminResourceId = "AstriaAdmin";
	
	const { userId } = adminData;
	
	const adminRegistry = await getParticipantRegistry(`${adminNamespace}.${adminResourceId}`);
	const factory = getFactory();
	
	let result = await query("AstriaAdminById", { userId });
	if (result.length > 0) {
		throw new Error("Account already exists");
	}
	
	const admin = factory.newResource(adminNamespace, adminResourceId, userId);
	
	return adminRegistry.add(admin);
}


/**
 * Create AstriaVoter
 * @param {org.astria.participant.CreateAstriaVoter} voterData The voter to be created.
 * @transaction
 * */
async function createVoter(voterData) {
	const namespace = "org.astria.participant";
	const resourceId = "AstriaVoter";
	const voteNamespace = "org.astria.vote";
	const voteResourceId = "Vote";
	const electionResPath = "org.astria.election.Election";
	
	const { userId, electionId } = voterData;
	
	const currentParticipant = getCurrentParticipant();
	
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	if (!election){
		throw new Error("Invalid election");
	}
	
	const adminId = currentParticipant.getIdentifier();
	if (adminId !== election.adminId && election.managers.indexOf(adminId) === -1){
		throw new Error("Unauthorised to perform the action");
	}
	
	if (election.freeze) {
		throw new Error("Election frozen, can't add voters now");
	}
	
	const voterId = generateId(resourceId, userId, electionId);
	const voteId = voterId;
	
	let result = await query("VoterById", { userId : voterId });
	if (result.length > 0) {
		throw new Error("Voter already exists");
	}
	
	const voterRegistry = await getParticipantRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const voter = factory.newResource(namespace, resourceId, voterId);
	voter.electionId = electionId;
	
	const voteRegistry = await getAssetRegistry(`${voteNamespace}.${voteResourceId}`);
	const vote = factory.newResource(voteNamespace, voteResourceId, voteId);
	vote.electionId = electionId;
	
	await voterRegistry.add(voter);
	return voteRegistry.add(vote);
}