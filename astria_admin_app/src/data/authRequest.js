/**
 * Created by StarkX on 23-Apr-19.
 */
import { AuthServerRequest, AstriaServerRequest } from "../util/server";

/*
* Register Admin
* @returns auth_token
* */
export async function RegisterUser(name, phone, email, password) {
	try {
		const data = await AstriaServerRequest("/admin/register", { name, phone, email, password });
		const { auth_token } = data.body;
		
		return auth_token;
	} catch (err) {
		throw new Error(err.message);
	}
}

/*
* Login User
* @returns auth_token
* */
export async function LoginUser(email, password) {
	try {
		const data = await AuthServerRequest("/admin/login", { email, password });
		const { auth_token } = data.body;
		
		return auth_token;
	} catch (err) {
		throw new Error(err.message);
	}
}