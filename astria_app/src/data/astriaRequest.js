/**
 * Created by StarkX on 23-Apr-19.
 */
import { AstriaServerRequest } from "../util/server";


/*
* Get Admin Profile
* @returns {profile:{name,phone}, email, userId}
* */
export async function GetProfile(auth_token) {
	try {
		const data = await AstriaServerRequest("/admin/profile", { auth_token });
		const { admin } = data;
		
		return admin;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Get All Elections
* @returns [{electionId, electionName, startDate, endDate, freeze, adminId, managers[]}]
* */
export async function GetAllElections() {
	try {
		const data = await AstriaServerRequest("/etc/allElections", {});
		const { elections } = data;
		
		elections.forEach((election) => {
			election.startDate = new Date(election.startDate);
			election.endDate = new Date(election.endDate);
		});
		
		return elections;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Get Election Details
* @returns {electionId, electionName, startDate, endDate, freeze, adminId, managers[], admin:{profile:{name,phone}, email, userId}}
* */
export async function GetElectionDetails(electionId) {
	try {
		const data = await AstriaServerRequest("/etc/election", { electionId });
		const { election } = data;
		
		election.startDate = new Date(election.startDate);
		election.endDate = new Date(election.endDate);
		
		return election;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Create Election
* @returns electionId
* */
export async function CreateElection(auth_token, electionName, startDate, endDate) {
	try {
		const data = await AstriaServerRequest("/admin/createElection", {
			auth_token,
			electionName,
			startDate,
			endDate
		});
		const { electionId } = data;
		
		return electionId;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Get Election Managers
* @returns [{profile:{name,phone}, email, userId}]
* */
export async function GetElectionManagers(auth_token, electionId) {
	try {
		const data = await AstriaServerRequest("/admin/getManagers", { auth_token, electionId });
		const { managers } = data;
		console.log(managers);
		return managers;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Get Election Candidates
* @returns [{candidateId, candidateName, logoURI, electionId}]
* */
export async function GetElectionCandidates(electionId) {
	try {
		const data = await AstriaServerRequest("/etc/candidates", { electionId });
		const { candidates } = data;
		console.log(candidates);
		return candidates;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Modify Election Dates
* @returns true
* */
export async function ModifyElectionDates(auth_token, startDate, endDate, electionId) {
	try {
		await AstriaServerRequest("/admin/modifyDates", { auth_token, startDate, endDate, electionId });
		
		return true;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Add Manager to Election
* @returns {profile:{name,phone}, email, userId}
* */
export async function AddElectionManager(auth_token, electionId, email) {
	try {
		const data = await AstriaServerRequest("/admin/addManager", { auth_token, electionId, email });
		const { manager } = data;
		
		return manager;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Add Election Candidate
* @returns candidateId
* */
export async function AddElectionCandidate(auth_token, electionId, candidateName, logoURI) {
	try {
		const data = await AstriaServerRequest("/admin/addCandidate", {
			auth_token,
			electionId,
			candidateName,
			logoURI
		});
		const { candidateId } = data;
		
		return candidateId;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Add Election Voter
* @returns {voterId, pin}
* */
export async function AddElectionVoter(auth_token, electionId, voterId) {
	try {
		const data = await AstriaServerRequest("/manager/addVoter", { auth_token, electionId, voterId });
		
		return data;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Freeze Election
* @returns {adminKey, managerKeys[]}
* */
export async function FreezeElection(auth_token, electionId) {
	try {
		const data = await AstriaServerRequest("/admin/freezeElection", { auth_token, electionId });
		
		return data;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Publish Election Result
* @returns {electionId, results:[{candidate:{candidateId, candidateName, logoURI, electionId},voteCount}]}
* */
export async function PublishElectionResult(auth_token, electionId, adminKey, managerKeys) {
	try {
		console.log(managerKeys);
		const data = await AstriaServerRequest("/admin/publishResult", {
			auth_token,
			electionId,
			adminKey,
			managerKeys
		});
		const { result } = data;
		
		return result;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Election Result Summary
* @returns {electionId, results:[{candidate:{candidateId, candidateName, logoURI, electionId},voteCount}]}
* */
export async function ElectionResultSummary(electionId) {
	try {
		const data = await AstriaServerRequest("/etc/resultSummary", { electionId });
		const { result } = data;
		
		return result;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Cast Vote
* @returns true
* */
export async function CastVote(userId, pin, candidateId, electionId) {
	try {
		await AstriaServerRequest("/voter/castVote", { userId, pin, candidateId, electionId });
		
		return true;
	} catch (err) {
		throw new Error(err.message);
	}
}


/*
* Verify Vote
* @returns true
* */
export async function VerifyVote(userId, pin, electionId) {
	try {
		const { vote } = await AstriaServerRequest("/voter/verifyVote", { userId, pin, electionId });
		
		return vote;
	} catch (err) {
		throw new Error(err.message);
	}
}