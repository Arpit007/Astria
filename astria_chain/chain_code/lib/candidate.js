/**
 * Created by StarkX on 06-Mar-19.
 */
'use strict';

function generateId(upperId, middleId, lowerId) {
	return sha256(`${upperId}-${middleId}-${lowerId}`);
}

/**
 * Create Candidate
 * @param {org.astria.candidate.CreateCandidate} candidateData The candidate to be created.
 * @returns {string} ID of the Candidate
 * @transaction
 * */
async function createCandidate(candidateData) {
	const resourceId = 'Candidate';
	const namespace = 'org.astria.candidate';
	const electionResPath = 'org.astria.election.Election';
	
	const { candidateName, logoURI, electionId } = candidateData;
	
	const currentParticipant = getCurrentParticipant();
	
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	if (!election) {
		throw new Error("Invalid election");
	}
	
	const adminId = currentParticipant.getIdentifier();
	if (adminId !== election.adminId) {
		throw new Error("Unauthorised to perform the action");
	}
	
	if (election.freeze) {
		throw new Error("Election frozen, can't add candidates now");
	}
	
	const candidateRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const candidateId = generateId(resourceId, electionId, `${candidateName}.${logoURI}`);
	
	let result = await query('CandidateById', { candidateId });
	if (result.length > 0) {
		throw new Error("Candidate already exists in election");
	}
	
	const candidate = factory.newResource(namespace, resourceId, candidateId);
	
	candidate.candidateName = candidateName;
	candidate.logoURI = logoURI;
	candidate.electionId = electionId;
	
	await candidateRegistry.add(candidate);
	
	return candidateId;
}