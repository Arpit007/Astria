import jwt from "jsonwebtoken";
import passport from "passport";
import express, { NextFunction, Request, Response, Router } from "express";

import Reply from "../../util/Reply";
import User from "../../models/User";
import logger from "../../util/logger";
import { JWT_SECRET } from "../../util/secrets";

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
            
            return req.logIn(user, async (err: Error) => {
                if (err) {
                    logger.error(err.message);
                    return Reply(res, 400, err.message);
                }
                
                try {
                    const {name, phone} = req.body;
                    
                    user.profile = {name, phone};
                    await user.save();
                    
                    const token = jwt.sign({id: user.email}, JWT_SECRET);
                    
                    return Reply(res, 200, {auth_token: token, userId: user._id});
                } catch (err) {
                    logger.error(err.message);
                    return Reply(res, 400, err.message);
                }
            });
        })(req, res, next);
});


router.post("/login", (req, res, next) => {
    return passport.authenticate("admin.login", {session: false},
        async (err: Error, user: any, info: any) => {
            if (err) {
                logger.error(err.message);
                return Reply(res, 400, err.message);
            }
            
            if (info !== undefined) {
                return Reply(res, 400, info.message);
            }
            
            return req.logIn(user, async (err: Error) => {
                if (err) {
                    return Reply(res, 400, err.message);
                }
                
                try {
                    const token = jwt.sign({id: user.email}, JWT_SECRET);
                    
                    return Reply(res, 200, {auth_token: token});
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
    try {
        const {userId} = req.body;
        const user = await User.findById(userId);
        
        if (!user) {
            return Reply(res, 400, "User not found");
        }
        
        return Reply(res, 200, {user: user.toJSON()});
    } catch (err) {
        return Reply(res, 400, err.message);
    }
});


router.post("/changePassword", Authenticate, async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        
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