/**
 * Created by StarkX on 23-Apr-19.
 */
import {
	FETCH_PROFILE_FAILURE, FETCH_PROFILE_INIT, FETCH_PROFILE_SUCCESS, LOGOUT,
	LOGIN_FAILURE, LOGIN_INIT, LOGIN_SUCCESS, SIGN_UP_FAILURE, SIGN_UP_INIT, SIGN_UP_SUCCESS
} from "../action/user";

const TOKEN_KEY = "astria.auth_token";
const defaultTokenState = { auth_token : localStorage.getItem(TOKEN_KEY) || "", isLoading : false };
const defaultProfileState = { profile : { profile : { name : "", phone : "" }, email : "" }, isLoading : false };

export function AuthToken(state = defaultTokenState, action) {
	switch (action.type) {
		case LOGIN_INIT:
		case SIGN_UP_INIT:
			return { auth_token : "", isLoading : true };
		
		case LOGIN_SUCCESS:
		case SIGN_UP_SUCCESS:
			const { auth_token } = action.payload;
			localStorage.setItem(TOKEN_KEY, auth_token);
			return { auth_token : auth_token, isLoading : false };
		
		case LOGIN_FAILURE:
		case SIGN_UP_FAILURE:
			console.error(action.err);
			return { auth_token : "", err : action.err, isLoading : false };
		
		case LOGOUT:
			localStorage.setItem(TOKEN_KEY, "");
			return { auth_token : "", isLoading : false };
		
		default:
			return state;
	}
}


export function Profile(state = defaultProfileState, action) {
	switch (action.type) {
		case FETCH_PROFILE_INIT:
			return { ...defaultProfileState, isLoading : true };
		
		case FETCH_PROFILE_SUCCESS:
			return { profile : action.payload.profile, isLoading : false };
		
		case FETCH_PROFILE_FAILURE:
			console.error(action.err);
			return { ...defaultProfileState, err : action.err };
		
		case LOGOUT:
			return { ...defaultProfileState, isLoading : false };
		
		default:
			return state;
	}
}