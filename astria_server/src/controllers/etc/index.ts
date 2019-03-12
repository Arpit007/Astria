import express, { Request, Response, Router } from "express";

const router: Router = express.Router();
export default router;

router.post('/hash', (req: Request, res: Response) => {
    console.log(req.body);
    return "Hello";
});