/**
 * Created by StarkX on 06-Mar-19.
 */
'use strict';

/**
 * Cast Vote
 * @param {org.astria.vote.castVote} voteData The vote to be casted.
 * @transaction
 * */

async function castVote(voteData) {
	const namespace = 'org.astria.vote';
	const resourceId = 'Vote';
	
	const { voteId, candidateId, electionId } = voteData;
	
	const voteRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	let result = await query('VoteById', {voteId});
	if (result.length > 0){
		throw new Error('Already Voted');
	}
}

function generateVoteId(voterId, electionId) {
	return sha256(`${electionId}-${voterId}`)
}