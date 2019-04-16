import { NextFunction, Request, Response } from "express";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import Reply from "../util/reply";
import { AUTH_SERVER } from "../util/secrets";


const Request = (endPoint: string, data: any): Promise<any> => {
    return AuthServer.post(endPoint, data)
        .then((response: AxiosResponse) => {
            const {data} = response;
            return data;
        })
        .catch((response: AxiosError) => {
            const {data} = response.response;
            throw data;
        });
};


const AuthServer: AxiosInstance = axios.create({
    baseURL: AUTH_SERVER
});


export async function GetAdminProfile(userId: string): Promise<any> {
    try {
        const data = await Request("/admin/profile", {userId});
        return data.body.user;
    } catch (err) {
        throw new Error(err.head ? err.head.msg : err.message);
    }
}


export async function AuthoriseAdmin(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const {auth_token} = req.body;
        
        if (!auth_token) {
            return Reply(res, 400, "Sign-In required");
        }
        
        const data = await Request("/admin/verify", {auth_token});
        const {user} = data.body;
        
        return req.logIn(user, () => next());
    } catch (err) {
        const msg = err.head ? err.head.msg : err.message;
        return Reply(res, 400, msg);
    }
}


export async function AuthoriseVoter(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const {auth_token} = req.body;
        
        if (!auth_token) {
            return Reply(res, 400, "Sign-In required");
        }
        
        const data = await Request("/voter/verify", {auth_token});
        const {user} = data.body;
        
        return req.logIn(user, () => next());
    } catch (err) {
        const msg = err.head ? err.head.msg : err.message;
        return Reply(res, 400, msg);
    }
}