import express, { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import Reply from "../../util/Reply";
import { JWT_SECRET } from "../../util/secrets";
import logger from "../../util/logger";
import User from "../../models/User";

const Authenticate = passport.authenticate("admin.jwt", {session: false});
const router: Router = express.Router();
export default router;


router.post("/register", (req: Request, res: Response, next: NextFunction) => {
    return passport.authenticate("admin.register", {session: false},
        async (err: Error, user: any, info: any) => {
            if (err) {
                logger.error(err.message);
                return Reply(res, 400, err.message);
            }
            
            if (info !== undefined) {
                return Reply(res, 400, info.message);
            }
            
            req.logIn(user, async (err: Error) => {
                if (err) {
                    logger.error(err.message);
                    return Reply(res, 400, err.message);
                }
                
                try {
                    const {name, phone} = req.body;
                    
                    user.profile = {name, phone};
                    await user.save();
                    
                    const token = jwt.sign({id: user.email}, JWT_SECRET);
                    
                    return Reply(res, 200, {token});
                } catch (err) {
                    logger.error(err.message);
                    return Reply(res, 400, err.message);
                }
            });
        })(req, res, next);
});


router.post("/login", (req, res, next) => {
    return passport.authenticate("admin.login", {session: false}, async (err: Error, user: any, info: any) => {
        if (err) {
            logger.error(err.message);
            return Reply(res, 400, err.message);
        }
        
        if (info !== undefined) {
            return Reply(res, 400, info.message);
        }
        
        req.logIn(user, async (err: Error) => {
            if (err) {
                return Reply(res, 400, err.message);
            }
            
            try {
                const token = jwt.sign({id: user.email}, JWT_SECRET);
                
                return Reply(res, 200, {token});
            } catch (err) {
                return Reply(res, 400, err.message);
            }
        });
    })(req, res, next);
});


router.post("/verify", Authenticate, (req: Request, res: Response) => {
    return Reply(res, 200, {user: req.user.toJSON()});
});


router.post("/profile", async (req: Request, res: Response) => {
    const {id} = req.body;
    try {
        const user = await User.findById(id);
        
        return Reply(res, 200, {user: user.toJSON()});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


router.post("/changePassword", Authenticate, async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    
    try {
        const user = req.user;
        return user.comparePassword(oldPassword, async (err: Error, isMatch: boolean) => {
            if (err) {
                logger.error(err.message);
                return Reply(res, 400, err.message);
            }
            if (isMatch) {
                if (oldPassword === newPassword) {
                    return Reply(res, 400, "New Password can't be same as Old Password");
                }
                
                user.password = newPassword;
                await user.save();
                
                return Reply(res, 200, {});
            }
            
            return Reply(res, 400, "Invalid Old Password");
        });
    } catch (err) {
        logger.error(err.message);
        return Reply(res, 400, err.message);
    }
});