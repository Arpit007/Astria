/**
 * Created by StarkX on 23-Apr-19.
 */

export const LOGOUT = "LOGOUT";

export function logoutUser() {
	return (dispatch, getState) => {
		return dispatch({ type : LOGOUT });
	};
}