import app from "./app";
import express, { NextFunction } from "express";
import Reply from "./util/Reply";


app.use((req: express.Request, res: express.Response, next: NextFunction) => {
    return Reply(res, 404, "Not Found");
});


const server = app.listen(app.get("port"), () => {
    console.log(`App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
});

export default server;
