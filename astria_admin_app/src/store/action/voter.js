/**
 * Created by StarkX on 25-Apr-19.
 */
import { CastVote } from "../../data/astriaRequest";

export const CAST_VOTE_INIT = "CAST_VOTE_INIT";
export const CAST_VOTE_SUCCESS = "CAST_VOTE_SUCCESS";
export const CAST_VOTE_FAILURE = "CAST_VOTE_FAILURE";


export function castVote(userId, pin, candidateId) {
	return async (dispatch, getState) => {
		dispatch({ type : CAST_VOTE_INIT });
		
		try {
			const state = getState();
			const { electionId } = state.election.election;
			
			await CastVote(userId, pin, candidateId, electionId);
			
			return dispatch({ type : CAST_VOTE_SUCCESS });
		} catch (err) {
			return dispatch({ type : CAST_VOTE_FAILURE, err : err.message });
		}
	};
}