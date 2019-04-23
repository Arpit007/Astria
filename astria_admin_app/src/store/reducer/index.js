import { combineReducers } from 'redux';
import { AuthToken } from "./auth";
import { Profile } from "./user";
import { Election } from "./election";

const rootReducer = combineReducers({
	auth_token : AuthToken,
	profile : Profile,
	election : Election
});

export default rootReducer;