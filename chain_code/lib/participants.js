'use strict';

/*async function Vote(vote) {
	
	// Don't allow a used ballot to be processed
	if (vote.ballot.used == true) {
		throw 'Ballot already used';
	} else if (vote.ballot.owner.hasVoted) {
		throw 'Voter alreay voted';
	} else {
		vote.ballot.owner.hasVoted = true;
		vote.ballot.owner.Choice = vote.newOwner.party.PartyName + vote.newOwner.firstName;
		const ParticipantRegistry = await getParticipantRegistry('test.Voter');
		await ParticipantRegistry.update(vote.ballot.owner);
		// Set new owner of vote
		vote.ballot.owner = vote.newOwner;
		// Mark ballot as used
		vote.ballot.used = true;
		// Get the asset registry for the asset.
		const assetRegistry = await getAssetRegistry('test.Ballot');
		// Update the asset in the asset registry.
		await assetRegistry.update(vote.ballot);
	}
}*/

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

function generateId(role) {
	/*
	* Todo: Fix
	* */
	return `${role}${new Date().getTime()}`;
}