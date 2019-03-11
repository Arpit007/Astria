import app from "./app";
import express, { NextFunction } from "express";
import Reply from "./util/Reply";


app.use((req: express.Request, res: express.Response, next: NextFunction) => {
    return Reply(res, 404, "Not Found");
});


/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
});

export default server;
