import { combineReducers } from 'redux';

import { Profile } from "./user";
import { AuthToken } from "./auth";
import { AllElections, Election, GetCandidates, GetManagers } from "./election";

const rootReducer = combineReducers({
	auth_token : AuthToken,
	profile : Profile,
	election : Election,
	allElections : AllElections,
	managers : GetManagers,
	candidates : GetCandidates
});

export default rootReducer;