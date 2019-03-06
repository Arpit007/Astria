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
	
	const { adminId, electionName, startDate, endDate } = electionData;
	
	const electionRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const electionId = generateID(resourceId, adminId);
	const election = factory.newResource(namespace, resourceId, electionId);
	
	election.electionName = electionName;
	election.startDate = startDate;
	election.endDate = endDate;
	election.candidates = [];
	election.admin = factory.newRelationship('org.astria.participant', 'AstriaAdmin', adminId);
	
	return electionRegistry.add(election);
}

function generateID(resourceId, adminId) {
	return `${resourceId}-${adminId}-1`;
}