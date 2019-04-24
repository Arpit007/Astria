/**
 * Created by StarkX on 24-Apr-19.
 */
import {
	AddElectionCandidate, AddElectionManager, AddElectionVoter,
	CreateElection, ElectionResultSummary, FreezeElection,
	GetAllElections,
	GetElectionCandidates,
	GetElectionDetails,
	GetElectionManagers, ModifyElectionDates, PublishElectionResult
} from "../../data/astriaRequest";

export const UPDATE_ELECTION = "UPDATE_ELECTION";
export const ADD_ELECTION = "ADD_ELECTION";
export const ADD_CANDIDATE = "ADD_CANDIDATE";
export const ADD_MANAGER = "ADD_MANAGER";

export const FETCH_ALL_ELECTIONS_INIT = "FETCH_ALL_ELECTIONS_INIT";
export const FETCH_ALL_ELECTIONS_SUCCESS = "FETCH_ALL_ELECTIONS_SUCCESS";
export const FETCH_ALL_ELECTIONS_FAILURE = "FETCH_ALL_ELECTIONS_FAILURE";

export const FETCH_ELECTIONS_INIT = "FETCH_ELECTIONS_INIT";
export const FETCH_ELECTIONS_SUCCESS = "FETCH_ELECTIONS_SUCCESS";
export const FETCH_ELECTIONS_FAILURE = "FETCH_ELECTIONS_FAILURE";

export const CREATE_ELECTION_INIT = "CREATE_ELECTION_INIT";
export const CREATE_ELECTION_SUCCESS = "CREATE_ELECTION_SUCCESS";
export const CREATE_ELECTION_FAILURE = "CREATE_ELECTION_FAILURE";

export const FETCH_MANAGERS_INIT = "FETCH_MANAGERS_INIT";
export const FETCH_MANAGERS_SUCCESS = "FETCH_MANAGERS_SUCCESS";
export const FETCH_MANAGERS_FAILURE = "FETCH_MANAGERS_FAILURE";

export const FETCH_CANDIDATES_INIT = "FETCH_CANDIDATES_INIT";
export const FETCH_CANDIDATES_SUCCESS = "FETCH_CANDIDATES_SUCCESS";
export const FETCH_CANDIDATES_FAILURE = "FETCH_CANDIDATES_FAILURE";

export const CREATE_CANDIDATES_INIT = "CREATE_CANDIDATES_INIT";
export const CREATE_CANDIDATES_SUCCESS = "CREATE_CANDIDATES_SUCCESS";
export const CREATE_CANDIDATES_FAILURE = "CREATE_CANDIDATES_FAILURE";

export const ADD_VOTER_INIT = "ADD_VOTER_INIT";
export const ADD_VOTER_SUCCESS = "ADD_VOTER_SUCCESS";
export const ADD_VOTER_FAILURE = "ADD_VOTER_FAILURE";

export const MODIFY_DATES_INIT = "MODIFY_DATES_INIT";
export const MODIFY_DATES_SUCCESS = "MODIFY_DATES_SUCCESS";
export const MODIFY_DATES_FAILURE = "MODIFY_DATES_FAILURE";

export const FETCH_RESULT_INIT = "FETCH_RESULT_INIT";
export const FETCH_RESULT_SUCCESS = "FETCH_RESULT_SUCCESS";
export const FETCH_RESULT_FAILURE = "FETCH_RESULT_FAILURE";

export const ADD_MANAGER_INIT = "ADD_MANAGER_INIT";
export const ADD_MANAGER_SUCCESS = "ADD_MANAGER_SUCCESS";
export const ADD_MANAGER_FAILURE = "ADD_MANAGER_FAILURE";

export const FREEZE_ELECTION_INIT = "FREEZE_ELECTION_INIT";
export const FREEZE_ELECTION_SUCCESS = "FREEZE_ELECTION_SUCCESS";
export const FREEZE_ELECTION_FAILURE = "FREEZE_ELECTION_FAILURE";

export const PUBLISH_RESULT_INIT = "PUBLISH_RESULT_INIT";
export const PUBLISH_RESULT_SUCCESS = "PUBLISH_RESULT_SUCCESS";
export const PUBLISH_RESULT_FAILURE = "PUBLISH_RESULT_FAILURE";


export function fetchAllElections() {
	return async (dispatch, getState) => {
		dispatch({ type : FETCH_ALL_ELECTIONS_INIT });
		
		try {
			const elections = await GetAllElections();
			return dispatch({ type : FETCH_ALL_ELECTIONS_SUCCESS, payload : { elections } });
		} catch (err) {
			return dispatch({ type : FETCH_ALL_ELECTIONS_FAILURE, err : err.message });
		}
	};
}


export function fetchElection(electionId) {
	return async (dispatch, getState) => {
		dispatch({ type : FETCH_ELECTIONS_INIT });
		
		try {
			const election = await GetElectionDetails(electionId);
			dispatch({ type : FETCH_ELECTIONS_SUCCESS, payload : { election } });
			
			if (election.voteDecKey) {
				try {
					dispatch({ type : FETCH_RESULT_INIT });
					
					const result = await ElectionResultSummary(electionId);
					dispatch({ type : FETCH_RESULT_SUCCESS, payload : { result : result.results } });
				} catch (err) {
					return dispatch({ type : FETCH_RESULT_FAILURE, err : err.message });
				}
			}
		} catch (err) {
			return dispatch({ type : FETCH_ELECTIONS_FAILURE, err : err.message });
		}
	}
}


export function createElection(electionName, startDate, endDate) {
	return async (dispatch, getState) => {
		dispatch({ type : CREATE_ELECTION_INIT });
		
		try {
			const state = getState();
			const { auth_token } = state.auth_token;
			const { profile } = state.profile;
			const { elections } = state.allElections;
			
			const electionId = await CreateElection(auth_token, electionName, startDate, endDate);
			const election = {
				electionId, electionName, startDate, endDate, freeze : false, adminId : profile.userId, managers : []
			};
			
			dispatch({ type : ADD_ELECTION, payload : { elections : [ election, ...elections ] } });
			return dispatch({ type : CREATE_ELECTION_SUCCESS, payload : { election } });
		} catch (err) {
			return dispatch({ type : CREATE_ELECTION_FAILURE, err : err.message });
		}
	};
}


export function getElectionManagers(electionId) {
	return async (dispatch, getState) => {
		dispatch({ type : FETCH_MANAGERS_INIT });
		
		try {
			const state = getState();
			const { auth_token } = state.auth_token;
			
			const managers = await GetElectionManagers(auth_token, electionId);
			
			return dispatch({ type : FETCH_MANAGERS_SUCCESS, payload : { managers } });
		} catch (err) {
			return dispatch({ type : FETCH_MANAGERS_FAILURE, err : err.message });
		}
	};
}


export function getElectionCandidates(electionId) {
	return async (dispatch, getState) => {
		dispatch({ type : FETCH_CANDIDATES_INIT });
		
		try {
			const candidates = await GetElectionCandidates(electionId);
			
			return dispatch({ type : FETCH_CANDIDATES_SUCCESS, payload : { candidates } });
		} catch (err) {
			return dispatch({ type : FETCH_CANDIDATES_FAILURE, err : err.message });
		}
	};
}


export function createElectionCandidate(candidateName, logoURI) {
	return async (dispatch, getState) => {
		dispatch({ type : CREATE_CANDIDATES_INIT });
		
		try {
			const state = getState();
			const { auth_token } = state.auth_token;
			const { electionId } = state.election.election;
			const { candidates } = state.candidates;
			
			const candidateId = await AddElectionCandidate(auth_token, electionId, candidateName, logoURI);
			const candidate = { candidateId, candidateName, electionId, logoURI };
			
			dispatch({ type : ADD_CANDIDATE, payload : { candidates : [ ...candidates, candidate ] } });
			return dispatch({ type : CREATE_CANDIDATES_SUCCESS });
			
		} catch (err) {
			return dispatch({ type : CREATE_CANDIDATES_FAILURE, err : err.message });
		}
	}
}


export function addElectionVoter(voterId) {
	return async (dispatch, getState) => {
		dispatch({ type : ADD_VOTER_INIT });
		
		try {
			const state = getState();
			const { auth_token } = state.auth_token;
			const { electionId } = state.election.election;
			
			const { pin } = await AddElectionVoter(auth_token, electionId, voterId);
			
			return dispatch({ type : ADD_VOTER_SUCCESS, payload : { voterId, pin } });
			
		} catch (err) {
			return dispatch({ type : ADD_VOTER_FAILURE, err : err.message });
		}
	}
}


export function modifyElectionDates(startDate, endDate) {
	return async (dispatch, getState) => {
		dispatch({ type : MODIFY_DATES_INIT });
		
		try {
			const state = getState();
			const { auth_token } = state.auth_token;
			const { electionId } = state.election.election;
			
			await ModifyElectionDates(auth_token, startDate, endDate, electionId);
			
			return dispatch({ type : MODIFY_DATES_SUCCESS, payload : {} });
		} catch (err) {
			return dispatch({ type : MODIFY_DATES_FAILURE, err : err.message });
		}
	};
}


export function addElectionManager(email) {
	return async (dispatch, getState) => {
		dispatch({ type : ADD_MANAGER_INIT });
		
		try {
			const state = getState();
			const { auth_token } = state.auth_token;
			const { electionId } = state.election.election;
			const { managers } = state.managers;
			
			const manager = await AddElectionManager(auth_token, electionId, email);
			
			dispatch({ type : ADD_MANAGER, payload : { managers : [ ...managers, manager ] } });
			return dispatch({ type : ADD_MANAGER_SUCCESS, payload : {} });
		} catch (err) {
			return dispatch({ type : ADD_MANAGER_FAILURE, err : err.message });
		}
	};
}


export function freezeElection() {
	return async (dispatch, getState) => {
		dispatch({ type : FREEZE_ELECTION_INIT });
		
		try {
			const state = getState();
			const { auth_token } = state.auth_token;
			const { election } = state.election;
			const { electionId } = election;
			
			const { adminKey, managerKeys } = await FreezeElection(auth_token, electionId);
			
			dispatch({ type : FREEZE_ELECTION_SUCCESS, payload : { adminKey, managerKeys } });
			return dispatch({ type : UPDATE_ELECTION, payload : { election : { ...election, freeze : true } } });
		} catch (err) {
			return dispatch({ type : FREEZE_ELECTION_FAILURE, err : err.message });
		}
	};
}


export function publishElectionResult(adminKey, managerKeys) {
	return async (dispatch, getState) => {
		dispatch({ type : PUBLISH_RESULT_INIT });
		
		try {
			const state = getState();
			const { auth_token } = state.auth_token;
			const { electionId } = state.election.election;
			
			const result = await PublishElectionResult(auth_token, electionId, adminKey, managerKeys);
			
			return dispatch({ type : PUBLISH_RESULT_SUCCESS, payload : { result : result.results } });
		} catch (err) {
			return dispatch({ type : PUBLISH_RESULT_FAILURE, err : err.message });
		}
	};
}