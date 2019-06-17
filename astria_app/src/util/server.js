/**
 * Created by StarkX on 22-Apr-19.
 */
import axios from "axios";
import { ASTRIA_SERVER_URL, AUTH_SERVER_URL } from "../data/config";

const AstriaServer = axios.create({
	baseURL : ASTRIA_SERVER_URL
});

export const AuthServer = axios.create({
	baseURL : AUTH_SERVER_URL
});

export const AstriaServerRequest = (endPoint, data) => {
	return AstriaServer.post(endPoint, data)
		.then((response) => {
			const {data} = response;
			return data.body;
		})
		.catch((response) => {
			const {data} = response.response;
			throw new Error(data.head ? data.head.msg : data);
		});
};

export const AuthServerRequest = (endPoint, data) => {
	return AuthServer.post(endPoint, data)
		.then((response) => {
			const {data} = response;
			return data.body;
		})
		.catch((response) => {
			const {data} = response.response;
			throw new Error(data.head ? data.head.msg : data);
		});
};