import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const  verifyJWT = asyncHandler(async(req,res,next)=>{
   try {
     // req got access of cokies from app.js where we have written app.use(cookieParser())
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")  // may or may get beacuse if user is using mobile it will send header
    
    if(!token) {
     throw new ApiError(401, "Unauthorized request")
    }
 
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) // we neeed secret to decode it
 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
     throw new ApiError(401,"Invalid Access Token")
    }
 
    req.user = user;
    next()
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
   }

})

