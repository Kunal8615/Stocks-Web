import User from "../models/user.model.js"
import { Apiresponce } from "../utils/Apiresponce.js";
import {Apierror} from "../utils/Apierror.js"
import { asynchandler } from "../utils/Asynchandler.js";
import { uploadonCloundinary } from "../utils/cloudinary.js";

import jwt, { decode } from "jsonwebtoken"





const GenerateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Apierror(404, "User not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();


        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);  
        throw new Apierror(500, error.message || "something went wrong while generating tokens");
    }
};


const RegisterUser = asynchandler(async (req,res)=>{
    const {name,email,username,password,pan,role} = req.body;
    if ([name,pan, email, username, password,role].some(field => !field || field.trim() === "")) {
        throw new Apierror(400, "All fields are required");
    }

    const existuser = await User.findOne({
        $or:[{username},{email},{pan}]
    })

    if(existuser){
        throw new Apierror(400, "User already exists");
    }
    const profilePicturePath = req.files?.photo?.[0].path;
    if(!profilePicturePath){

        throw new Apierror(400, "Profile picture is required");
    }
    const profilePicture = await uploadonCloundinary(profilePicturePath);

    if(!profilePicture){
        throw new Apierror(500, "Failed to upload profile picture");
    }

    //create user
    const user = await User.create({
        name,
        email,
        username,
        pan,
        photo: profilePicture.url,
        password,
        role
    })
    const createUser = await User.findById(user.id).select("-password -refreshToken")
    

    if(!createUser){
        throw new Apierror(500, "Failed to create user");
    }
    console.log("user created");
    return res.status(200).json(new Apiresponce(200,createUser,"user registration done"));
  
})
const logoutUser = asynchandler(async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: {
          refreshToken: 1
        }
      }, {
        new: true
      });
      const options = {
        httpOnly: true,
        secure: true
      };
 
  console.log("user logout done");
      return res.status(200)
        .clearCookie("accessToken", options).clearCookie("refreshToken", options)
        .json(new Apiresponce(200, {}, "User logged out"));
    } catch (error) {
      return res.status(500).json(new Apiresponce(500, {}, "An error occurred during logout"));
    }
  });



const loginUser = asynchandler(async (req,res)=>{
    const {email, password} = req.body;
    if (!email) {
        throw new Apierror(400, "All fields are required");
    }
    const user = await User.findOne({email});

    if(!user){
        throw new Apierror(401, "Invalid credentials");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new Apierror(401, "Invalid user credentials");
    }

    
    const {accessToken, refreshToken} = await GenerateAccessAndRefreshTokens(user._id)
    const loggedUser = await User.findById(user._id).select("-password -refreshToken")
    const option = {
       /*  httpOnly: true,
        sameSite: "None",
        secure : true,
         expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000) */

    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      
    }
 console.log(loggedUser,"Login Done");

 return res.status(200)
 .cookie("accessToken", accessToken, option)
 .cookie("refreshToken", refreshToken,option)
 .json(new Apiresponce(200,{user : loggedUser,accessToken,refreshToken},"User logged in successfully"));
})

const getUser = asynchandler(async (req, res) => {
    try {
    console.log(req.user)
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new Apierror(404, "User not found");
        }

        return res.status(200).json(new Apiresponce(200, user, "User's data fetched"));
    } catch (error) {
        res.status(500).json(new Apiresponce(500,{}, error.message));
    }
});


const GetCurrentUser = asynchandler(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return next(new Apierror(404, "User not found"));
    }

  
    const userData = await User.findById(user._id).select("-password");


    if (!userData) {
        return next(new Apierror(404, "User not found"));
    }

    return res.status(200).json(
        new Apiresponce(200, userData, "User fetched successfully")
    );
});

const addMoney = asynchandler(async (req, res) => {
    try {
      const amount = parseInt(req.body.amount, 10); 
  
      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Apierror(400, "Invalid amount");
      }
  
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Apierror(404, "User not found");
      }
  
      user.wallet_money += amount; 
      await user.save();
  
      res.status(200).json(new Apiresponce(200, user, "Amount added successfully"));
    } catch (error) {
      console.error(error); // log the real error
      throw new Apierror(500, error.message || "Problem while adding money to wallet");
    }
  });
  

export {RegisterUser,loginUser,logoutUser,GetCurrentUser,addMoney}