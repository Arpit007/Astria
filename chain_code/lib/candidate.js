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
	let eResult = await query('ElectionByAdminId', { adminId : currentParticipant.getIdentifier() });
	
	if (eResult.length <=0){
		throw new Error("Invalid Election");
	}
	
	const election = eResult[0];
	
	if (new Date().getTime() >= election.startDate.getTime()) {
		throw new Error("Can't create candidate after election has begun");
	}
	
	const candidateRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const candidateId = generateCandidateId(resourceId, election.electionId, candidateName);
	
	let result = await query('CandidateById', { candidateId });
	if (result.length > 0) {
		throw new Error("Candidate Already Exists");
	}
	
	const candidate = factory.newResource(namespace, resourceId, candidateId);
	
	candidate.candidateName = candidateName;
	candidate.logoURI = logoURI;
	
	await candidateRegistry.add(candidate);
	
	const electionRegistry = await getAssetRegistry(electionResPath);
	
	election.candidates.push(candidate);
	
	return electionRegistry.update(election);
}


function generateCandidateId(resourceId, electionId, candidateName) {
	return sha256(`${resourceId}-${electionId}-${candidateName}`);
}