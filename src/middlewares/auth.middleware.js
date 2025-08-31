import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { expressAsyncHandler } from "../utils/expressAsyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJwtToken = expressAsyncHandler(async (req , _, next)=>{
    
    const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

    if(!token) throw new ApiError(401 , "no accessToken found");

    const decodedInformation =jwt.verify(token , process.env.ACCESS_TOKEN_SECRET_KEY );

    const user = User.findById(decodedInformation?._id).select("-password -refreshToken");

    if(!user) throw new ApiError(401 , "invalid accesToken");

    req.user = user;
    next();
})

