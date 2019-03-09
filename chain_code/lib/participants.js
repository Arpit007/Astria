'use strict';

/**
 * Create AstriaAdmin
 * @param {org.astria.participant.CreateAdmin} adminData The admin to be created.
 * @transaction
 * */
async function createAdmin(adminData) {
	const adminNamespace = 'org.astria.participant';
	const adminResourceId = 'AstriaAdmin';
	const electionNamespace = 'org.astria.election';
	const electionResourceId = 'Election';
	
	const { voteKey, idKey, email, electionName, startDate, endDate } = adminData;
	
	let eStartDate = startDate.getTime();
	let eEndDate = endDate.getTime();
	let today = new Date().getTime();
	
	if (eStartDate <= today || eEndDate <= startDate) {
		throw new Error("Invalid Election Dates");
	}
	
	const adminRegistry = await getParticipantRegistry(`${adminNamespace}.${adminResourceId}`);
	const factory = getFactory();
	
	const adminId = generateId(adminResourceId, new Date().getTime());
	const admin = factory.newResource(adminNamespace, adminResourceId, adminId);
	
	const electionId = generateId(electionResourceId, adminId);
	
	admin.voteKey = voteKey;
	admin.idKey = idKey;
	admin.email = email;
	admin.electionId = electionId;
	
	await adminRegistry.add(admin);
	
	const electionRegistry = await getAssetRegistry(`${electionNamespace}.${electionResourceId}`);
	const election = factory.newResource(electionNamespace, electionResourceId, electionId);
	
	election.electionName = electionName;
	election.startDate = startDate;
	election.endDate = endDate;
	election.candidates = [];
	election.adminId = adminId;
	
	return electionRegistry.add(election);
}


/**
 * Create AstriaManager
 * @param {org.astria.participant.CreateManager} managerData The manager to be created.
 * @transaction
 * */
async function createManager(managerData) {
	const namespace = 'org.astria.participant';
	const resourceId = 'AstriaManager';
	const electionResPath = 'org.astria.election.Election';
	
	const { email } = managerData;
	
	const currentParticipant = getCurrentParticipant();
	
	const electionId = currentParticipant.electionId;
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	if (new Date().getTime() >= election.startDate.getTime()) {
		throw new Error("Can't add Manager now.");
	}
	
	const managerRegistry = await getParticipantRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const managerId = generateId(resourceId, new Date().getTime());
	const manager = factory.newResource(namespace, resourceId, managerId);
	
	manager.electionId = election.electionId;
	manager.email = email;
	
	return managerRegistry.add(manager);
}


/**
 * Create AstriaVoter
 * @param {org.astria.participant.CreateVoter} voterData The voter to be created.
 * @transaction
 * */
async function createVoter(voterData) {
	const namespace = 'org.astria.participant';
	const resourceId = 'AstriaVoter';
	const voteNamespace = 'org.astria.vote';
	const voteResourceId = 'Vote';
	const electionResPath = 'org.astria.election.Election';
	
	const { voterId } = voterData;
	
	const currentParticipant = getCurrentParticipant();
	
	const electionId = currentParticipant.electionId;
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	if (new Date().getTime() >= election.startDate.getTime()) {
		throw new Error("Can't add Voter now.");
	}
	
	let result = await query('VoterById', { userId : voterId });
	if (result.length > 0) {
		throw new Error('Voter Already Exists');
	}
	
	const voterRegistry = await getParticipantRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const voter = factory.newResource(namespace, resourceId, voterId);
	voter.electionId = election.electionId;
	
	const voteRegistry = await getAssetRegistry(`${voteNamespace}.${voteResourceId}`);
	
	const voteId = generateId(voterId, electionId);
	const vote = factory.newResource(voteNamespace, voteResourceId, voteId);
	vote.voterId = voterId;
	
	await voterRegistry.add(voter);
	return voteRegistry.add(vote);
}


function generateId(upperId, lowerId) {
	return sha256(`${upperId}-${lowerId}`);
}