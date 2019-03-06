/**
 * Created by StarkX on 06-Mar-19.
 */
'use strict';

/**
 * Todo: Check if one Election already exists
 * */

/**
 * Create Election
 * @param {org.astria.election.CreateElection} electionData The election to be created.
 * @transaction
 * */
async function createElection(electionData) {
	const namespace = 'org.astria.election';
	const resourceId = 'Election';
	
	const electionRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const electionId = generateId('Election');
	const election = factory.newResource(namespace, resourceId, electionId);
	
	election.electionName = electionData.electionName;
	election.startDate = electionData.startDate;
	election.endDate = electionData.endDate;
	election.candidates = [];
	election.admin = factory.newRelationship('org.astria.participant', 'AstriaAdmin', electionData.adminId);
	
	return electionRegistry.add(election);
}

function generateId(role) {
	/*
	* Todo: Fix
	* */
	return `${role}${new Date().getTime()}`;
}