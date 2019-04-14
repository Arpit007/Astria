import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User";
import { JWT_SECRET } from "../util/secrets";


const InvalidAuthMsg = "Invalid Email/Password";

passport.serializeUser(function(user, done) {
    done(undefined, user);
});

passport.deserializeUser(function(user, done) {
    done(undefined, user);
});

// Sign-Up
passport.use("admin.register", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: false
}, async (email: string, password: string, done: any) => {
    try {
        let user = await User.findOne({email: email.toLocaleLowerCase()});
        
        if (user !== null) {
            return done(undefined, false, {message: "Email already registered"});
        }
        
        user = await User.create({
            email,
            password
        });
        
        return done(undefined, user);
    } catch (err) {
        return done(err);
    }
}));


// Sign-In
passport.use("admin.login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: false
}, async (email: string, password: string, done: any) => {
    try {
        const user: any = await User.findOne({email: email.toLocaleLowerCase()});
        
        if (!user) {
            return done(undefined, false, {message: InvalidAuthMsg});
        }
        
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, {message: InvalidAuthMsg});
        });
    } catch (err) {
        return done(err);
    }
}));


// JWT-Extract
passport.use("admin.jwt", new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromBodyField("token"),
    secretOrKey: JWT_SECRET
}, async (payload: any, done: any) => {
    try {
        const user = await User.findOne({email: payload.id});
        
        if (!user) {
            return done(undefined, false, {message: "User not found"});
        }
        
        return done(undefined, user);
    } catch (err) {
        return done(err);
    }
}));

// Todo: Add Expiry to JWT