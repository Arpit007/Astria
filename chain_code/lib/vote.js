/**
 * Created by StarkX on 06-Mar-19.
 */
'use strict';

/**
 * Cast Vote
 * @param {org.astria.vote.CastVote} voteData The vote to be casted.
 * @transaction
 * */
async function castVote(voteData) {
	const namespace = 'org.astria.vote';
	const resourceId = 'Vote';
	const electionResPath = 'org.astria.election.Election';
	
	const currentParticipant = getCurrentParticipant();
	const electionId = currentParticipant.electionId;
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	if (!election) {
		throw new Error("Invalid Election");
	}
	
	const today = new Date().getTime();
	const startDate = election.startDate.getTime();
	const endDate = election.endDate.getTime();
	
	if (today < startDate || today > endDate) {
		throw new Error("Can't cast vote now");
	}

	const { voterId, candidateId } = voteData;

	let result = await query('VoteByVoterId', {voterId});
	const vote = result[0];

	if(vote.hasVoted){
		throw new Error('Already Voted');
	}

	vote.candidateId = candidateId;
	vote.hasVoted = true;

	const voteRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	return voteRegistry.update(vote);
}