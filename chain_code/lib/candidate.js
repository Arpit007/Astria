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
	
	if (!election){
		throw new Error("Invalid Election");
	}
	
	const adminId = currentParticipant.getIdentifier();
	if (adminId !== election.adminId){
		throw new Error("Not Allowed");
	}
	
	if (election.freeze) {
		throw new Error("Can't add Candidate now.");
	}

	const candidateRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();

	const candidateId = generateId(resourceId, electionId, `${candidateName}-${logoURI}`);

	let result = await query('CandidateById', { candidateId });
	if (result.length > 0) {
		throw new Error("Candidate Already Exists");
	}

	const candidate = factory.newResource(namespace, resourceId, candidateId);

	candidate.candidateName = candidateName;
	candidate.logoURI = logoURI;
	candidate.electionId = electionId;

	return candidateRegistry.add(candidate);
}