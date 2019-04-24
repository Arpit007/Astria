/**
 * Created by StarkX on 25-Apr-19.
 */
import { CastVote, VerifyVote } from "../../data/astriaRequest";

export const CAST_VOTE_INIT = "CAST_VOTE_INIT";
export const CAST_VOTE_SUCCESS = "CAST_VOTE_SUCCESS";
export const CAST_VOTE_FAILURE = "CAST_VOTE_FAILURE";

export const VERIFY_VOTE_INIT = "VERIFY_VOTE_INIT";
export const VERIFY_VOTE_SUCCESS = "VERIFY_VOTE_SUCCESS";
export const VERIFY_VOTE_FAILURE = "VERIFY_VOTE_FAILURE";


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


export function verifyVote(userId, pin) {
	return async (dispatch, getState) => {
		dispatch({ type : VERIFY_VOTE_INIT });
		
		try {
			const state = getState();
			const { electionId } = state.election.election;
			
			const vote = await VerifyVote(userId, pin, electionId);
			console.log(vote);
			
			return dispatch({ type : VERIFY_VOTE_SUCCESS, payload : { vote } });
		} catch (err) {
			return dispatch({ type : VERIFY_VOTE_FAILURE, err : err.message });
		}
	};
}