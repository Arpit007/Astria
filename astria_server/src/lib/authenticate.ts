import { NextFunction, Request, Response } from "express";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import Reply from "../util/reply";
import { AUTH_SERVER, PIN_LENGTH } from "../util/secrets";


const AuthServer: AxiosInstance = axios.create({
    baseURL: AUTH_SERVER
});


const Request = (endPoint: string, data: any): Promise<any> => {
    return AuthServer.post(endPoint, data)
        .then((response: AxiosResponse) => {
            const {data} = response;
            return data;
        })
        .catch((response: AxiosError) => {
            const {data} = response.response;
            throw new Error(data.head ? data.head.msg : data);
        });
};


export async function GetAdminProfile(userId: string): Promise<any> {
    try {
        const data = await Request("/admin/profile", {userId});
        const {user} = data.body;
        user.userId = user._id;
        
        return user;
    } catch (err) {
        throw new Error(err.message);
    }
}


export async function CreateAdmin(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const data = await Request("/admin/register", {...req.body});
        req.user = data.body;
        
        next();
    } catch (err) {
        return Reply(res, 400, err.message);
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
        user.userId = user._id;
        
        req.user = user;
        
        next();
    } catch (err) {
        return Reply(res, 400, err.message);
    }
}


export function AuthoriseVoter(req: Request, res: Response, next: NextFunction) {
    const {userId, pin} = req.body;
    if (!userId) {
        return Reply(res, 400, "userId required");
    }
    if (!pin) {
        return Reply(res, 400, "Pin required");
    }
    if (pin.length !== PIN_LENGTH) {
        return Reply(res, 400, "Invalid Pin");
    }
    
    req.user = {userId, pin};
    next();
}