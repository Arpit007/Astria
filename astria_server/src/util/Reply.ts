import { Response } from "express";

export default function Reply(res: Response, code: number, body: any) {
    const reply: any = {
        head: {
            code,
            msg: "ok"
        },
        body: {}
    };
    
    if (code >= 200 && code < 300) {
        reply.body = body;
    } else {
        reply.head.msg = body;
    }
    
    return res.status(code).json(reply);
}