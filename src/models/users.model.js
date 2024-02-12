import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        },
        watchList: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods = {
    comparePassword: async function(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generateAccessToken: function() {
        return jwt.sign({
            _id: this._id,
            email: this.email,
            username: this.username,
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
    },
    generateRefreshToken: function() {
        return jwt.sign({
            _id: this._id
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
    }
}

export const User = model('User', userSchema);