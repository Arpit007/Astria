import { combineReducers } from 'redux';

import { AuthToken, Profile } from "./user";
import {
	AllElections,
	GetElection,
	GetCandidates,
	GetManagers,
	CreateElection,
	CreateCandidate,
	AddVoter, ModifyDates
} from "./election";

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
	modifyDates : ModifyDates
});

export default rootReducer;