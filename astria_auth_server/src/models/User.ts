import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
import MongooseHidden from "mongoose-hidden";

const mongooseHidden = MongooseHidden();
const BCRYPT_SALT_ROUNDS = 12;

export type UserModel = mongoose.Document & {
    email: string,
    password: string,
    
    profile: {
        name: string,
        phone: string
    },
    
    comparePassword: comparePasswordFunction
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: String,
    
    profile: {
        name: String,
        phone: String
    }
}, {timestamps: true});

userSchema.plugin(mongooseHidden, { hidden : { _id : false, password : true } });

userSchema.pre("save", function (next) {
    const user = <UserModel>this;
    
    if (!this.isModified("password")) {
        return next();
    }
    
    bcrypt.genSalt(BCRYPT_SALT_ROUNDS, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

const User = mongoose.model("User", userSchema);

export default User;