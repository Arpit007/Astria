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
	
	const { candidateName, logoURI, electionId } = candidateData;
	
	const candidateRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const candidateId = generateId(resourceId, electionId, candidateName);
	const candidate = factory.newResource(namespace, resourceId, candidateId);
	
	candidate.candidateName = candidateName;
	candidate.logoURI = logoURI;
	
	await candidateRegistry.add(candidate);
	
	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);
	
	election.candidates.push(candidate);
	
	return electionRegistry.update(election);
}


function generateId(resourceId, electionId, candidateName) {
	return `${resourceId}-${electionId}-${candidateName}`;
}