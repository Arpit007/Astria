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
	const namespace = 'org.astria.candidate';
	const resourceId = 'Candidate';
	
	const candidateRegistry = await getAssetRegistry(`${namespace}.${resourceId}`);
	const factory = getFactory();
	
	const candidateId = generateId('Candidate');
	const candidate = factory.newResource(namespace, resourceId, candidateId);
	
	candidate.candidateName = candidateData.candidateName;
	candidate.logoURI = candidateData.logoURI;
	
	await candidateRegistry.add(candidate);
	
	const electionRegistry = await getAssetRegistry('org.astria.election.Election');
	const election = await electionRegistry.get(candidateData.electionId);
	
	election.candidates.push(candidate);
	
	return electionRegistry.update(election);
}


function generateId(role) {
	/*
	* Todo: Fix
	* */
	return `${role}${new Date().getTime()}`;
}