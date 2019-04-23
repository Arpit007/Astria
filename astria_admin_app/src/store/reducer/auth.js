/**
 * Created by StarkX on 23-Apr-19.
 */
import {
	LOGIN_FAILURE,
	LOGIN_INIT,
	LOGIN_SUCCESS,
	LOGOUT,
	SIGN_UP_FAILURE,
	SIGN_UP_INIT,
	SIGN_UP_SUCCESS
} from "../action/auth";

const TOKEN_KEY = "astria.auth_token";
const defaultTokenState = { auth_token : localStorage.getItem(TOKEN_KEY) || "", isLoading : false };


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