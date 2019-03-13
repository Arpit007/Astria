"use strict";

/**
 * Create AstriaAdmin
 * @param {org.astria.participant.CreateAdmin} adminData The admin to be created.
 * @returns {string} ID of the AstriaAdmin
 * @transaction
 * */
async function createAdmin(adminData) {
	const adminNamespace = "org.astria.participant";
	const adminResourceId = "AstriaAdmin";
	const electionNamespace = "org.astria.election";
	const electionResourceId = "Election";

	const { voteKey, idKey, email, electionName, startDate, endDate, secret, loginId } = adminData;

	let eStartDate = startDate.getTime();
	let eEndDate = endDate.getTime();
	let today = new Date().getTime();

	if (eStartDate <= today || eEndDate <= startDate) {
		throw new Error("Invalid Election Dates");
	}

	let idAccounts = await query("AstriaAdminByLoginId", { loginId });
	if (idAccounts.length > 0){
		throw new Error("Admin LoginId already exists");
	}

	const adminRegistry = await getParticipantRegistry(`${adminNamespace}.${adminResourceId}`);
	const factory = getFactory();

	const adminId = generateId(adminResourceId, email, new Date().getTime());
	const admin = factory.newResource(adminNamespace, adminResourceId, adminId);

	const electionId = generateId(electionResourceId, adminId, new Date().getTime());

	admin.voteKey = voteKey;
	admin.idKey = idKey;
	admin.email = email;
	admin.electionId = electionId;
	admin.secret = secret;
	admin.loginId = loginId;

	await adminRegistry.add(admin);

	const electionRegistry = await getAssetRegistry(`${electionNamespace}.${electionResourceId}`);
	const election = factory.newResource(electionNamespace, electionResourceId, electionId);

	election.electionName = electionName;
	election.startDate = startDate;
	election.endDate = endDate;
	election.adminId = adminId;

	await electionRegistry.add(election);

	return adminId;
}


/**
 * Create AstriaManager
 * @param {org.astria.participant.CreateManager} managerData The manager to be created.
 * @returns {string} ID of the AstriaManager
 * @transaction
 * */
async function createManager(managerData) {
	const namespace = "org.astria.participant";
	const resourceId = "AstriaManager";
	const electionResPath = "org.astria.election.Election";

	const { email, secret, loginId } = managerData;

	const currentParticipant = getCurrentParticipant();

	const electionId = currentParticipant.electionId;
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);

	if (new Date().getTime() >= election.startDate.getTime()) {
		throw new Error("Can't add Manager now.");
	}

	let idAccounts = await query("AstriaManagerByLoginId", { loginId });
	if (idAccounts.length > 0){
		throw new Error("Manager LoginId already exists");
	}

	const managerRegistry = await getParticipantRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();

	const managerId = generateId(resourceId, electionId, new Date().getTime());
	const manager = factory.newResource(namespace, resourceId, managerId);

	manager.electionId = electionId;
	manager.email = email;
	manager.secret = secret;
	manager.loginId = loginId;

	await managerRegistry.add(manager);

	return managerId;
}


/**
 * Create AstriaVoter
 * @param {org.astria.participant.CreateVoter} voterData The voter to be created.
 * @transaction
 * */
async function createVoter(voterData) {
	const namespace = "org.astria.participant";
	const resourceId = "AstriaVoter";
	const voteNamespace = "org.astria.vote";
	const voteResourceId = "Vote";
	const electionResPath = "org.astria.election.Election";

	const { voterId } = voterData;

	const currentParticipant = getCurrentParticipant();

	const electionId = currentParticipant.electionId;
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);

	if (new Date().getTime() >= election.startDate.getTime()) {
		throw new Error("Can't add Voter now.");
	}

	let result = await query("VoterById", { userId : voterId });
	if (result.length > 0) {
		throw new Error("Voter Already Exists");
	}

	const voterRegistry = await getParticipantRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();

	const voter = factory.newResource(namespace, resourceId, voterId);
	voter.electionId = election.electionId;

	const voteRegistry = await getAssetRegistry(`${voteNamespace}.${voteResourceId}`);

	const voteId = generateId(voteResourceId, voterId, electionId);
	const vote = factory.newResource(voteNamespace, voteResourceId, voteId);
	vote.electionId = electionId;

	voter.voteId = voteId;

	await voterRegistry.add(voter);
	return voteRegistry.add(vote);
}


function generateId(upperId, middleId, lowerId) {
	return sha256(`${upperId}-${middleId}-${lowerId}`);
}