/**
 * Created by StarkX on 25-Apr-19.
 */
import { CLOSE_MODAL } from "../action/error";

const errorDefaultState = { err : null, openModal : false };

export function ShowError(state = errorDefaultState, action) {
	switch (action.type) {
		case CLOSE_MODAL:
			return errorDefaultState;
		default:
			if (action.type.indexOf("FAILURE") !== -1) {
				return { err : action.err, openModal : true };
			}
			return errorDefaultState;
	}
}