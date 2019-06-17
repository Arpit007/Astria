/**
 * Created by StarkX on 06-Mar-19.
 */
'use strict';


function generateId(upperId, middleId, lowerId) {
	return sha256(`${upperId}-${middleId}-${lowerId}`);
}


/**
 * Create Election
 * @param {org.astria.election.CreateElection} electionData The election to be created.
 * @returns {string} ID of the Election
 * @transaction
 **/
async function createElection(electionData) {
	const electionNamespace = "org.astria.election";
	const electionResourceId = "Election";
	
	const { electionName, startDate, endDate } = electionData;
	
	let startDateL = startDate.getTime();
	let endDateL = endDate.getTime();
	let today = new Date().getTime();
	
	if (startDateL <= today || endDateL <= startDateL) {
		throw new Error("Invalid election dates");
	}
	
	const currentParticipant = getCurrentParticipant();
	const adminId = currentParticipant.getIdentifier();
	
	const electionRegistry = await getAssetRegistry(`${electionNamespace}.${electionResourceId}`);
	const factory = getFactory();
	
	const electionId = generateId(electionResourceId, adminId, new Date().getTime());
	const election = factory.newResource(electionNamespace, electionResourceId, electionId);
	
	election.electionName = electionName;
	election.startDate = startDate;
	election.endDate = endDate;
	election.adminId = adminId;
	election.managers = [];
	
	await electionRegistry.add(election);
	
	return electionId;
}


/**
 * Modify Election Dates
 * @param {org.astria.election.ModifyElectionDates} electionData The election to be updated.
 * @transaction
 **/
async function modifyElectionDates(electionData) {
	const electionResPath = 'org.astria.election.Election';
	
	const { electionId, startDate, endDate } = electionData;
	
	const currentParticipant = getCurrentParticipant();
	const adminId = currentParticipant.getIdentifier();
	
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	if (!election){
		throw new Error("Invalid election");
	}
	
	if (adminId !== election.adminId){
		throw new Error("Unauthorised to perform the action");
	}
	
	if (election.freeze){
		throw new Error("Election frozen, can't update dates now");
	}
	
	let startDateL = startDate.getTime();
	let endDateL = endDate.getTime();
	let today = new Date().getTime();
	
	if (startDateL <= today || endDateL <= startDateL) {
		throw new Error("Invalid election dates");
	}
	
	election.startDate = startDate;
	election.endDate = endDate;
	
	return electionRegistry.update(election);
}


/**
 * Set Election Vote Decrypt Key
 * @param {org.astria.election.SetElectionVoteDecKey} electionData The election to be updated.
 * @transaction
 **/
async function setElectionVoteDecKey(electionData) {
	const electionResPath = 'org.astria.election.Election';
	
	const { electionId, voteDecKey } = electionData;
	
	const currentParticipant = getCurrentParticipant();
	const adminId = currentParticipant.getIdentifier();
	
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	if (!election){
		throw new Error("Invalid election");
	}
	
	const endDate = election.endDate.getTime();
	const today = new Date().getTime();
	
	if (adminId !== election.adminId) {
		throw new Error("Unauthorised to perform the action");
	}
	
	if (!election.freeze || today <= endDate){
		throw new Error("Allowed after voting period is over");
	}
	
	election.voteDecKey = voteDecKey;
	
	return electionRegistry.update(election);
}


/**
 * Freeze the Election
 * @param {org.astria.election.FreezeElection} electionData The election to be frozen.
 * @transaction
 **/
async function freezeElection(electionData) {
	const electionResPath = 'org.astria.election.Election';
	
	const { electionId, voteEncKey } = electionData;
	
	const currentParticipant = getCurrentParticipant();
	const adminId = currentParticipant.getIdentifier();
	
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	if (!election){
		throw new Error("Invalid election");
	}
	
	const startDate = election.startDate.getTime();
	const endDate = election.endDate.getTime();
	const today = new Date().getTime();
	
	if (adminId !== election.adminId) {
		throw new Error("Not allowed");
	}
	
	if (election.freeze){
		throw new Error("Election already frozen");
	}
	
	if (startDate <= today || endDate <= startDate) {
		throw new Error("Invalid election dates");
	}
	
	election.voteEncKey = voteEncKey;
	election.freeze = true;
	
	return electionRegistry.update(election);
}


/**
 * Add manager to the election
 * @param {org.astria.election.AddElectionManagers} electionData The managers to be added to the election.
 * @returns {string} ID of the Manager
 * @transaction
 **/
async function addElectionManagers(electionData) {
	const electionResPath = 'org.astria.election.Election';
	
	const { electionId, email } = electionData;
	
	const currentParticipant = getCurrentParticipant();
	const adminId = currentParticipant.getIdentifier();
	
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	if (!election){
		throw new Error("Invalid election");
	}
	
	const result = await query('AstriaAdminByEmail', { email });
	if (result.length === 0) {
		throw new Error("No such user exists");
	}
	
	const managerId = result[0].userId;
	
	if (adminId !== election.adminId || managerId === adminId) {
		throw new Error("Not allowed");
	}
	
	if (election.freeze){
		throw new Error("Election frozen, can't add managers now");
	}
	
	if (election.managers.indexOf(managerId) !== -1){
		throw new Error("Already added as manager");
	}
	
	election.managers.push(managerId);
	
	await electionRegistry.update(election);
	
	return managerId;
}