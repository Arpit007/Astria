/**
 * Created by StarkX on 22-Apr-19.
 */
import axios from "axios";
import { ASTRIA_SERVER_URL, AUTH_SERVER_URL } from "../data/config";

export const AstriaServer = axios.create({
	baseURL : ASTRIA_SERVER_URL
});

export const AuthServer = axios.create({
	baseURL : AUTH_SERVER_URL
});
