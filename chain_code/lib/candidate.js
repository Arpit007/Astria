/**
 * Created by StarkX on 06-Mar-19.
 */
'use strict';

/**
 * Create Candidate
 * @param {org.astria.candidate.CreateCandidate} candidateData The candidate to be created.
 * @transaction
 * */
async function createCandidate(candidateData) {
	const electionResPath = 'org.astria.election.Election';
	const namespace = 'org.astria.candidate';
	const resourceId = 'Candidate';

	const { candidateName, logoURI } = candidateData;

	const currentParticipant = getCurrentParticipant();

	const electionId = currentParticipant.electionId;
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);

	if (new Date().getTime() >= election.startDate.getTime()) {
		throw new Error("Can't add Candidate now.");
	}

	const candidateRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();

	const candidateId = generateId(resourceId, election.electionId, candidateName);

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


function generateId(upperId, middleId, lowerId) {
	return sha256(`${upperId}-${middleId}-${lowerId}`);
}