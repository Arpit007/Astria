/**
 * Created by StarkX on 25-Apr-19.
 */

export const CLOSE_MODAL = "CLOSE_MODAL";

export function closeErrorModal() {
	return async (dispatch, getState) => {
		dispatch({ type : CLOSE_MODAL });
	}
}