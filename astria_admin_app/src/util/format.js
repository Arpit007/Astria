/**
 * Created by StarkX on 23-Apr-19.
 */
import moment from "moment";

export function formatDate(date) {
	return moment(date).format("llll")
}