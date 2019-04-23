import { LOGOUT } from "../action/auth";

/**
 * Created by StarkX on 23-Apr-19.
 */
const defaultProfileState = { profile : null, isLoading : false };

export function Profile(state = defaultProfileState, action) {
	switch (action.type) {
		case LOGOUT:
			return {profile: null, isLoading : false};
		default:
			return {
				"profile" : {
					"name" : "Arpit Bhatnagar",
					"phone" : "9711431657"
				},
				"email" : "arpit2011@live.com",
				"userId" : "5cb99fdf1f82183a1c3cdd89"
			};
	}
}