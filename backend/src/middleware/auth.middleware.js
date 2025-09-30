

import User from '../models/user.model.js';
import { Apiresponce } from '../utils/Apiresponce.js';
import { asynchandler } from "../utils/Asynchandler.js";
import jwt from "jsonwebtoken";


const verifyJWT = asynchandler(async (req, res, next) => { 
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
           
            return res.status(401).json(
                new Apiresponce(401, null, "Unauthorized request: Token missing")
            );
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        if (!user) {
            return res.status(401).json(
                new Apiresponce(401, null, "Invalid Access Token: User does not exist")
            );
        }

        req.user = user;
        next();

    } catch (error) {
       
        return res.status(401).json(
            new Apiresponce(401, null, "Invalid or expired access token")
        );
    }
});

export default verifyJWT;