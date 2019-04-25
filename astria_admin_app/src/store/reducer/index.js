import { combineReducers } from 'redux';

import { AuthToken, Profile } from "./user";
import {
	AllElections, GetElection, GetCandidates, GetManagers, CreateElection, CreateCandidate,
	AddVoter, ModifyDates, FetchResult, AddManager, FreezeElection, PublishElectionResult
} from "./election";
import { CastVote, VerifyVote } from "./voter";
import { ShowError } from "./error";

const rootReducer = combineReducers({
	auth_token : AuthToken,
	profile : Profile,
	election : GetElection,
	allElections : AllElections,
	managers : GetManagers,
	candidates : GetCandidates,
	createElection : CreateElection,
	createCandidate : CreateCandidate,
	addVoter : AddVoter,
	modifyDates : ModifyDates,
	result : FetchResult,
	addManager : AddManager,
	freezeElection : FreezeElection,
	publishResult : PublishElectionResult,
	castVote : CastVote,
	verifyVote: VerifyVote,
	error: ShowError
});

export default rootReducer;