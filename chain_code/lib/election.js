/**
 * Created by StarkX on 06-Mar-19.
 */
'use strict';


/**
 * Create Election
 * @param {org.astria.election.UpdateElection} electionData The election to be updated.
 * @transaction
 **/
async function updateElection(electionData) {
	const electionResPath = 'org.astria.election.Election';

	const { startDate, endDate } = electionData;

	const currentParticipant = getCurrentParticipant();
	const electionId = currentParticipant.electionId;

	let eStartDate = startDate.getTime();
	let eEndDate = endDate.getTime();
	let today = new Date().getTime();

	if (eStartDate <= today){
		throw new Error("Can't change time now");
	}

	if (eEndDate <= startDate) {
		throw new Error("Invalid Election Dates");
	}

	const electionRegistry = await getAssetRegistry(electionResPath);
	const election = await electionRegistry.get(electionId);

	election.startDate = startDate;
	election.endDate = endDate;

	return electionRegistry.update(election);
}