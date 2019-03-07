'use strict';

/**
 * Create Manager
 * @param {org.astria.participant.CreateManager} managerData The manager to be created.
 * @transaction
 * */
async function createManager(managerData) {
	const namespace = 'org.astria.participant';
	const resourceId = 'AstriaManager';

	const { electionId } = managerData;

	const managerRegistry = await getParticipantRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();

	const managerId = generateManagerId(resourceId, new Date().getTime());
	const manager = factory.newResource(namespace, resourceId, managerId);

	manager.election = factory.newRelationship(electionNamespace, electionResId, electionId);

	return managerRegistry.add(manager);
}


/**
 * Create Voter
 * @param {org.astria.participant.CreateVoter} voterData The voter to be created.
 * @transaction
 * */
async function createVoter(voterData) {
	const electionNamespace = 'org.astria.election';
	const electionResId = 'Election';
	const namespace = 'org.astria.participant';
	const resourceId = 'AstriaVoter';
	const voteNamespace = 'org.astria.vote';
	const voteResourceId = 'Vote';

	const { electionId, voterId } = voterData;

	let result = await query('VoterById', { userId : voterId });
	if (result.length > 0) {
		throw new Error('Voter Already Exists');
	}

	const voterRegistry = await getParticipantRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();

	const voter = factory.newResource(namespace, resourceId, voterId);

	voter.election = factory.newRelationship(electionNamespace, electionResId, electionId);

	const voteRegistry = await getAssetRegistry(`${voteNamespace}.${voteResourceId}`);

	const voteId = generateVoteId(voterId, electionId);
	const vote = factory.newResource(voteNamespace, voteResourceId, voteId);
	vote.voterId = voterId;

	await voterRegistry.add(voter);
	return voteRegistry.add(vote);
}


function generateManagerId(resourceId, time) {
	return sha256(`${resourceId}-${time}`);
}

function generateVoteId(voterId, electionId) {
	return sha256(`${electionId}-${voterId}`)
}