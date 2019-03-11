import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({msg: "Hello World!"});
});

router.get("/hi", (req: Request, res: Response) => {
    res.json({msg: "Yooo"});
});

export default router;