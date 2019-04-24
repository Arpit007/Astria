/**
 * Created by StarkX on 23-Apr-19.
 */
import {
	ADD_CANDIDATE,
	ADD_ELECTION,
	ADD_VOTER_FAILURE,
	ADD_VOTER_INIT,
	ADD_VOTER_SUCCESS,
	CREATE_CANDIDATES_FAILURE,
	CREATE_CANDIDATES_INIT,
	CREATE_CANDIDATES_SUCCESS,
	CREATE_ELECTION_FAILURE,
	CREATE_ELECTION_INIT,
	CREATE_ELECTION_SUCCESS,
	FETCH_ALL_ELECTIONS_FAILURE,
	FETCH_ALL_ELECTIONS_INIT,
	FETCH_ALL_ELECTIONS_SUCCESS,
	FETCH_CANDIDATES_FAILURE,
	FETCH_CANDIDATES_INIT,
	FETCH_CANDIDATES_SUCCESS,
	FETCH_ELECTIONS_FAILURE,
	FETCH_ELECTIONS_INIT,
	FETCH_ELECTIONS_SUCCESS,
	FETCH_MANAGERS_FAILURE,
	FETCH_MANAGERS_INIT,
	FETCH_MANAGERS_SUCCESS, FETCH_RESULT_FAILURE,
	FETCH_RESULT_INIT,
	FETCH_RESULT_SUCCESS,
	MODIFY_DATES_FAILURE,
	MODIFY_DATES_INIT,
	MODIFY_DATES_SUCCESS
} from "../action/election";


const allElectionDefaultState = { elections : [], isLoading : false };
const electionDefaultState = {
	election : {
		electionId : "",
		electionName : "",
		startDate : new Date(),
		endDate : new Date(),
		freeze : false,
		adminId : "",
		managers : [],
		admin : { profile : { name : "", phone : "" }, email : "", userId : "" }
	}, isLoading : false,
	redirect : false
};
const createElectionDefaultState = { isLoading : false };
const managersDefaultState = { managers : [], isLoading : false };
const candidatesDefaultState = { candidates : [], isLoading : false };
const createCandidateDefaultState = { isLoading : false };
const addVoterDefaultState = { isLoading : false };
const modifyDatesDefaultState = { isLoading : false };
const resultDefaultState = { result : [], isLoading : false };

export function GetElection(state = electionDefaultState, action) {
	switch (action.type) {
		case FETCH_ELECTIONS_INIT:
			return { ...electionDefaultState, isLoading : true };
		
		case FETCH_ELECTIONS_SUCCESS:
			return { election : action.payload.election, isLoading : false };
		
		case FETCH_ELECTIONS_FAILURE:
			console.error(action.err);
			return { ...electionDefaultState, err : action.err };
		
		default:
			return state;
	}
}


export function AllElections(state = allElectionDefaultState, action) {
	switch (action.type) {
		case FETCH_ALL_ELECTIONS_INIT:
			return { elections : [], isLoading : true };
		
		case ADD_ELECTION:
		case FETCH_ALL_ELECTIONS_SUCCESS:
			return { elections : action.payload.elections, isLoading : false };
		
		case FETCH_ALL_ELECTIONS_FAILURE:
			console.error(action.err);
			return { ...allElectionDefaultState, err : action.err };
		
		default:
			return state;
	}
}


export function CreateElection(state = createElectionDefaultState, action) {
	switch (action.type) {
		case CREATE_ELECTION_INIT:
			return { ...createElectionDefaultState, isLoading : true };
		
		case CREATE_ELECTION_SUCCESS:
			return { ...createElectionDefaultState, isLoading : false };
		
		case CREATE_ELECTION_FAILURE:
			console.error(action.err);
			return { ...createElectionDefaultState, err : action.err };
		
		default:
			return state;
	}
}


export function GetManagers(state = managersDefaultState, action) {
	switch (action.type) {
		case FETCH_MANAGERS_INIT:
			return { ...managersDefaultState, isLoading : true };
		
		case FETCH_MANAGERS_SUCCESS:
			return { managers : action.payload.managers, isLoading : false };
		
		case FETCH_MANAGERS_FAILURE:
			console.error(action.err);
			return { ...managersDefaultState, err : action.err };
		
		default:
			return state;
	}
}


export function GetCandidates(state = candidatesDefaultState, action) {
	switch (action.type) {
		case FETCH_CANDIDATES_INIT:
			return { ...candidatesDefaultState, isLoading : true };
		
		case ADD_CANDIDATE:
		case FETCH_CANDIDATES_SUCCESS:
			return { candidates : action.payload.candidates, isLoading : false };
		
		case FETCH_CANDIDATES_FAILURE:
			console.error(action.err);
			return { ...candidatesDefaultState, err : action.err };
		
		default:
			return state;
	}
}


export function CreateCandidate(state = createCandidateDefaultState, action) {
	switch (action.type) {
		case CREATE_CANDIDATES_INIT:
			return { ...createCandidateDefaultState, isLoading : true };
		
		case CREATE_CANDIDATES_SUCCESS:
			return { isLoading : false };
		
		case CREATE_CANDIDATES_FAILURE:
			console.error(action.err);
			return { ...createCandidateDefaultState, err : action.err };
		
		default:
			return state;
	}
}


export function AddVoter(state = addVoterDefaultState, action) {
	switch (action.type) {
		case ADD_VOTER_INIT:
			return { ...addVoterDefaultState, isLoading : true };
		
		case ADD_VOTER_SUCCESS:
			console.log("Voter", action.payload);
			return { isLoading : false };
		
		case ADD_VOTER_FAILURE:
			console.error(action.err);
			return { ...addVoterDefaultState, err : action.err };
		
		default:
			return state;
	}
}


export function ModifyDates(state = modifyDatesDefaultState, action) {
	switch (action.type) {
		case MODIFY_DATES_INIT:
			return { ...modifyDatesDefaultState, isLoading : true };
		
		case MODIFY_DATES_SUCCESS:
			return { isLoading : false };
		
		case MODIFY_DATES_FAILURE:
			console.error(action.err);
			return { ...modifyDatesDefaultState, err : action.err };
		
		default:
			return state;
	}
}


export function FetchResult(state = resultDefaultState, action) {
	switch (action.type) {
		case FETCH_RESULT_INIT:
			return { ...resultDefaultState, isLoading : true };
		
		case FETCH_RESULT_SUCCESS:
			return { result : action.payload.result, isLoading : false };
		
		case FETCH_RESULT_FAILURE:
			console.error(action.err);
			return { ...resultDefaultState, err : action.err };
		
		default:
			return state;
	}
}