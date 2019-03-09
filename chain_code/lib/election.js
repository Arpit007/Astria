/**
 * Created by StarkX on 06-Mar-19.
 */
'use strict';

/**
 * Create Election
 * @param {org.astria.election.CreateElection} electionData The election to be created.
 * @transaction
 * */
async function createElection(electionData) {
	const namespace = 'org.astria.election';
	const resourceId = 'Election';
	
	const { electionName, startDate, endDate } = electionData;
	const currentParticipant = getCurrentParticipant();
	const adminId = currentParticipant.getIdentifier();
	
	let eStartDate = new Date(startDate).getTime();
	let eEndDate = new Date(endDate).getTime();
	let today = new Date().getTime();
	
	if (eStartDate <= today || eEndDate <= startDate) {
		throw new Error("Invalid Election Dates");
	}
	
	const electionRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const electionId = generateElectionID(resourceId, adminId);
	
	let result = await query('ElectionById', { electionId });
	if (result.length > 0) {
		throw new Error("Can't create multiple elections with same account");
	}
	
	const election = factory.newResource(namespace, resourceId, electionId);
	
	election.electionName = electionName;
	election.startDate = startDate;
	election.endDate = endDate;
	election.candidates = [];
	election.adminId = adminId;
	
	return electionRegistry.add(election);
}

function generateElectionID(resourceId, adminId) {
	return sha256(`${resourceId}-${adminId}`);
}