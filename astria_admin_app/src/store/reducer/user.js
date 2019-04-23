import { LOGOUT } from "../action/auth";

/**
 * Created by StarkX on 23-Apr-19.
 */

export function Profile(state, action) {
	switch (action.type) {
		case LOGOUT:
			return "";
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