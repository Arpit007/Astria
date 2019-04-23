/**
 * Created by StarkX on 23-Apr-19.
 */
import { LOGOUT } from "../action/auth";

export function AuthToken(state, action) {
	switch (action.type) {
		case LOGOUT:
			return "";
		default:
			return "Hi";
	}
}