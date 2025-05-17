import User from "../models/userModel.js";  
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = "defgghjkgfdsacbnfhjkllvgghddrfccvvhhfwrtydasafhjkkkyrtrropp";

const authMiddleware = async (req, res, next) => {
    try {

        const token = req.cookies.token || req.headers["authorization"].split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
        
        
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);

        
        const fetchedUser = await User.findById(decodedToken.userId);

        if (!fetchedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

            
        req.user = fetchedUser;

    
        return next();
    } catch (error) {
        console.log(error); 
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export default authMiddleware;




 