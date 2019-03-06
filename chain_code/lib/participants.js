'use strict';

/**
 * Todo: Check if Participant already exists
 * */

/**
 * Create Manager
 * @param {org.astria.participant.CreateManager} managerData The manager to be created.
 * @transaction
 * */
async function createManager(managerData) {
	const namespace = 'org.astria.participant';
	const resourceId = 'AstriaManager';
	
	const managerRegistry = await getParticipantRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const managerId = generateId('Manager');
	const manager = factory.newResource(namespace, resourceId, managerId);

	manager.election = factory.newRelationship('org.astria.election', 'Election', managerData.electionId);
	
	return managerRegistry.add(manager);
}


/**
 * Create Voter
 * @param {org.astria.participant.CreateVoter} voterData The voter to be created.
 * @transaction
 * */
async function createVoter(voterData) {
	const namespace = 'org.astria.participant';
	const resourceId = 'AstriaVoter';
	
	const voterRegistry = await getParticipantRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const voterId = generateId('Voter');
	const voter = factory.newResource(namespace, resourceId, voterId);
	
	voter.election = factory.newRelationship('org.astria.election', 'Election', voterData.electionId);
	
	return voterRegistry.add(voter);
}

function generateId(role) {
	/*
	* Todo: Fix
	* */
	return `${role}${new Date().getTime()}`;
}