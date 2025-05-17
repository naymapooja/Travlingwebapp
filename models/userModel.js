
import mongoose, { Schema } from "mongoose";
const userschema = new Schema({
    fullName: {
        type: String,
        required: true,
        min: [3, 'fullname must be at least  3 character long'],
        max: [60, 'fullname must be at almost 60 character long'],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,

    },
    location: {
        type: String,
        required: true,
        trim: true,
        max: [80, 'location must be almost 100 charater']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false,
        min: [8, 'password must be 8 characters long'],
    },
    otp: {
        type: String,
        select: false,
    },
    otpExpiry: {
        type: Date,
        select: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true
})

const user = mongoose.model("user", userschema)
export default user;