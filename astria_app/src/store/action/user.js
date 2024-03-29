/**
 * Created by StarkX on 23-Apr-19.
 */
import { LoginUser, RegisterUser } from "../../data/authRequest";
import { GetProfile } from "../../data/astriaRequest";

export const LOGOUT = "LOGOUT";

export const LOGIN_INIT = "LOGIN_INIT";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const SIGN_UP_INIT = "SIGN_UP_INIT";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const FETCH_PROFILE_INIT = "FETCH_PROFILE_INIT";
export const FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS";
export const FETCH_PROFILE_FAILURE = "FETCH_PROFILE_FAILURE";


export function logoutUser() {
	return (dispatch, getState) => {
		return dispatch({ type : LOGOUT });
	};
}


export function logInUser(email, password) {
	return async (dispatch, getState) => {
		dispatch({ type : LOGIN_INIT });
		
		try {
			const auth_token = await LoginUser(email, password);
			return dispatch({ type : LOGIN_SUCCESS, payload : { auth_token } });
		} catch (err) {
			return dispatch({ type : LOGIN_FAILURE, err : err.message });
		}
	};
}


export function registerUser(name, phone, email, password) {
	return async (dispatch, getState) => {
		dispatch({ type : SIGN_UP_INIT });
		
		try {
			const auth_token = await RegisterUser(name, phone, email, password);
			return dispatch({ type : SIGN_UP_SUCCESS, payload : { auth_token } });
		} catch (err) {
			return dispatch({ type : SIGN_UP_FAILURE, err : err.message });
		}
	};
}


export function fetchProfile() {
	return async (dispatch, getState) => {
		dispatch({ type : FETCH_PROFILE_INIT });
		
		try {
			const state = getState();
			const { auth_token } = state.auth_token;
			
			const profile = await GetProfile(auth_token);
			return dispatch({ type : FETCH_PROFILE_SUCCESS, payload : { profile } });
		} catch (err) {
			return dispatch({ type : FETCH_PROFILE_FAILURE, err : err.message });
		}
	};
}