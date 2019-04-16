import bcrypt from "bcrypt-nodejs";
import mongoose, { model, Model, Schema, Document } from "mongoose";

const BCRYPT_SALT_ROUNDS = 12;


export interface UserModel extends Document {
    email: string;
    password: string;
    profile: {
        name: string;
        phone: string;
    };
    
    comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;
}


const userSchema = new Schema({
        email: {type: String, unique: true},
        password: String,
        profile: {
            name: String,
            phone: String
        }
    },
    {timestamps: true});


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


userSchema.methods.comparePassword = function (candidatePassword: string, cb: any) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};


userSchema.set("toJSON", {
    transform: (doc: any, ret: any, opt: any) => {
        delete ret["password"];
        return ret;
    }
});

const User: Model<UserModel> = model<UserModel>("User", userSchema);

export default User;
