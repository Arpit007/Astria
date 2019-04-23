import { combineReducers } from 'redux';
import { AuthToken } from "./auth";
import { Profile } from "./user";
import { AllElections, Election, GetManagers } from "./election";

const rootReducer = combineReducers({
	auth_token : AuthToken,
	profile : Profile,
	election : Election,
	allElections: AllElections,
	managers: GetManagers
});

export default rootReducer;