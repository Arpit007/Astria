import moment from "moment";

/**
 * Created by StarkX on 23-Apr-19.
 */
export function formatDate(date) {
	const offset = new Date().getTimezoneOffset();
	return moment(date).utcOffset(offset).format("llll")
}