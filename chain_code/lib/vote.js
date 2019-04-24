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
	const voteResPath = 'org.astria.vote.Vote';
	const electionResPath = 'org.astria.election.Election';

	const currentParticipant = getCurrentParticipant();
	const electionId = currentParticipant.electionId;

	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);

	const today = new Date().getTime();
	const startDate = election.startDate.getTime();
	const endDate = election.endDate.getTime();

	if (!election.freeze || today < startDate || today > endDate) {
		throw new Error("Can't cast vote now");
	}

	const { candidateId, voteId } = voteData;

	const voteRegistry = await getAssetRegistry(voteResPath);
	const vote = await voteRegistry.get(voteId);
	
	if (!vote){
		throw new Error("Not allowed to vote");
	}

	if (vote.hasVoted) {
		throw new Error('Already voted');
	}

	vote.candidateId = candidateId;
	vote.hasVoted = true;

	return voteRegistry.update(vote);
}