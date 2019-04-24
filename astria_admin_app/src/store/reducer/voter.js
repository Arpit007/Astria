/**
 * Created by StarkX on 25-Apr-19.
 */
import {
	CAST_VOTE_FAILURE,
	CAST_VOTE_INIT,
	CAST_VOTE_SUCCESS, VERIFY_VOTE_FAILURE,
	VERIFY_VOTE_INIT,
	VERIFY_VOTE_SUCCESS
} from "../action/voter";

const castVoteDefaultState = { isLoading : false };
const verifyVoteDefaultState = { isLoading : false };


export function CastVote(state = castVoteDefaultState, action) {
	switch (action.type) {
		case CAST_VOTE_INIT:
			return { ...castVoteDefaultState, isLoading : true };
		
		case CAST_VOTE_SUCCESS:
			return { ...castVoteDefaultState, isLoading : false };
		
		case CAST_VOTE_FAILURE:
			console.log(action.err);
			return { ...castVoteDefaultState, err : action.err };
		
		default:
			return state;
	}
}


export function VerifyVote(state = verifyVoteDefaultState, action) {
	switch (action.type) {
		case VERIFY_VOTE_INIT:
			return { ...verifyVoteDefaultState, isLoading : true };
		
		case VERIFY_VOTE_SUCCESS:
			return { ...verifyVoteDefaultState, isLoading : false };
		
		case VERIFY_VOTE_FAILURE:
			console.log(action.err);
			return { ...verifyVoteDefaultState, err : action.err };
		
		default:
			return state;
	}
}