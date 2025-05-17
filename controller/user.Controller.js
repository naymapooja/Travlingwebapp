import user from "../models/userModel.js";
import bcrypt from "bcryptjs";
import sendverificationEmail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";


const JWT_SECRET_KEY = "defgghjkgfdsacbnfhjkllvgghddrfccvvhhfwrtydasafhjkkkyrtrropp"
export const SignUp = async (req, res) => {
    const { fullName, email, location, password } = req.body;

    // Check if all fields are provided
    if (!fullName || !email || !location || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let newUser;
        // Check if user already exists
        const existingUser = await user.findOne({ email }).select("+password +otp +otpExpiry");

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Correctly calculate OTP expiry (5 minutes from now)

        if (existingUser) {
            // If the user exists but the email isn't verified, update the OTP and other details
            if (existingUser.isEmailVerified) {
                return res.status(400).json({ message: "User already exists!" });
            } else {
                existingUser.fullName = fullName;
                existingUser.location = location;
                existingUser.password = hashedPassword; // Hash the new password before saving
                existingUser.otp = otp;
                existingUser.otpExpiry = otpExpiry;

                await existingUser.save();
            }
        } else {
            // Create a new user
            const newUser = await user.create({
                fullName,
                email,
                password: hashedPassword, // Save the hashed password
                location,
                otp,
                otpExpiry,
                isEmailVerified: false,
            });
        }
       
        // Send verification email with OTP
        await sendverificationEmail(fullName, email, otp);


        // Send success response
        return res.status(201).json({ message: "User signed up successfully. Please check your email for the OTP." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};


//verified

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the user by email and include the otp and otpExpiry fields
        const fetchedUser = await user.findOne({ email }).select("+otp +otpExpiry");
        if (!fetchedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Check if OTP exists and is still valid
        if (!fetchedUser.otp || !fetchedUser.otpExpiry) {
            return res.status(400).json({ success: false, message: "OTP not generated" });
        }

        // Check if OTP has expired
        if (Date.now() > fetchedUser.otpExpiry) {
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new OTP." });
        }

        // Check if the OTP matches
        if (fetchedUser.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        // OTP is correct, mark email as verified
        fetchedUser.isEmailVerified = true;
        fetchedUser.otp = null;
        fetchedUser.otpExpiry = null;
        await fetchedUser.save();

        // Return success response
        return res.status(200).json({ success: true, message: "Email verified successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};


//email resend

export const resendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({ message: "Invalid email" })
        }

        const fetchedUser = await user.findOne({ email }).select("+otp +otpExpiry")

        if (!fetchedUser){
            return res.status(404).json({ message: "User not found" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 100);

        fetchedUser.otp = otp
        fetchedUser.otpExpiry = otpExpiry;

        await fetchedUser.save()
        const { fullName } = fetchedUser;

        await sendverificationEmail(fullName, email, otp);

        res.status(200).send("Email resend successfully.");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server Error" })



    }
};


//Login

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const fetchedUser = await user.findOne({ email }).select("+password");

        if (!fetchedUser) {
            res.status(400).json({ message: "User is not found" });
        }

        const ispasswordcorrect = bcrypt.compare(password, fetchedUser.password);
        if (!ispasswordcorrect) {
            res.status(400).json({ message: "Invalid password" });

        }
        const token = jwt.sign({ userId: fetchedUser._id,email: fetchedUser.email }, JWT_SECRET_KEY);
        // res.cookie("token", token)
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
          })

        delete fetchedUser.password;

        return res.status(200).json({ message: "Login  successfully", user: fetchedUser, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error })
    }
};

// logout
export const logout = (req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"Logout successfully"});
    } catch (error) {
     res.status(500).json({message:"Internal server error"}); 
    }
};