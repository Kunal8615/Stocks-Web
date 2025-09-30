import User from '../models/user.model.js';
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asynchandler(async (req, _, next) => {
    let token;
    let decodedToken;

    try {
       
        token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            throw new Apierror(401, "Unauthorized request: Token missing");
        }

       
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            throw new Apierror(401, "Invalid or expired access token");
        }

       
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new Apierror(401, "Invalid Access Token: User does not exist");
        }

     
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error.message);
        throw new Apierror(401, error.message || "Unauthorized request");
    }
});

export default verifyJWT;
