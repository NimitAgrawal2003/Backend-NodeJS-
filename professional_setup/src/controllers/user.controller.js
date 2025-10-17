import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
const registerUser = asyncHandler( async ( req , res )=> {
      // get user  details from front end   
      // validation - not empty
      // check if user already exists: username , email
      // check for images , check for avatar
      // upload them to cloudinary , avatar
      // create user object - create entry in db
      // remove password and refresh token field from response
      // check for user creation
      // return res

     const {fullName , email , username , password }  = req.body        // to get these field from frontend
     console.log(" email: " , email);
     
     /*if (fullName === ""){     // we can apply if else and check for each field eg for email, username and password 
      throw new ApiError(400,"fullname is required")
     } */            

      if (
            [fullName,email,username,password].some((field) => field?.trim() === "")
      ){
            throw new ApiError(400, "All fields are required")
      }

      const existedUser = await User.findOne({   // User from user.model.js file in models
            $or: [{ username },{ email }]        // User will call mongoDB
      })             // it return user that find first

      if (existedUser){
            throw new ApiError(409,"User with email or username already exists")
      }

      const avatarLocalPath =  req.files?.avatar[0]?.path ;                // ? beacuse it is optinal we may get or not get
      const coverImageLocalPath = req.files?.coverImage[0]?.path;
      console.log("avatarLocalPath:", avatarLocalPath);

      if (!avatarLocalPath) {
            throw new ApiError(400 , "Avatar file is required")
      }

     const avatar = await uploadOnCloudinary(avatarLocalPath)
     console.log("Cloudinary avatar upload result:", avatar);

     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

     if(!avatar){
      throw new ApiError(400, "All fields are required")
     }

     const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",      // to check if there is cover image or not , if leave empty beacuse it is not compulsory
      email,
      password,
      username: username.toLowerCase()
     })

     const createdUser = await User.findById(user._id).select(   // in this we are finding weather the user created or not
      "-password -refreshToken"                                  // and if find we dont need password and refreshToken 
     )                                                           // beacuse we are sending it to the user in later code

     if (!createdUser){
      throw new ApiError(500,"Something went wrong while registering the user")
     }

     return res.status(201).json(
      new ApiResponse(200 , createdUser , "User registered Successfully")
     )
}) 

const generateAccessAndRefreshTokens = async(userId) => {
      try{
          const user = await User.findById(userId)
          const accessToken = user.generateAccessToken()
          const refreshToken = user.generateRefreshToken()

          user.refreshToken = refreshToken          // adding refresh token in user stored in database
          await user.save({ validateBeforeSave:false })      // kuch check mat kero bus safe kerlo

          return {accessToken , refreshToken}

      } catch(error){
            throw new ApiError(500, "Something went wrong while generating refresh and access token")
      }
}

const loginUser = asyncHandler(async( req, res ) => {
      // bring data from request(req) body
      // login on the basis of anyone username or email
      // find the user
      // password check 
      // access and refresh token
      // send cookie

      const {email , username , password} = req.body
      console.log(email);
      if (!username && !email){
            throw new ApiError(400 , "username or email is required ")
      }

      const user = await User.findOne({         // it return all the information about user
            $or: [{ username } , { email }]
      })

      if(!user){
            throw new ApiError(400, " User does not exist ")
      }

      const isPasswordValid =  await user.isPasswordCorrect(password);

        if(!isPasswordValid){
            throw new ApiError(401, " Invalid user credentials ")
      }
      const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

     const loggedInUser = await User.findById(user._id).
     select("-password -refreshToken")      
     
     const options = {
      httpOnly : true,
      secure: true
     }

     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken", refreshToken,options)
     .json(
      new ApiResponse(200,{
            user: loggedInUser, accessToken,refreshToken
      },
      "User logged In Successfully"
     )
   )
})

const logoutUser = asyncHandler(async(req,res)=>{
      await User.findByIdAndUpdate(
            req.user._id,
            {
                  $set:{
                        refreshToken: undefined
                  }
            },
            {
                  new:true
            }
      )

      const options = {
            httpOnly:true,
            secure:true
      }

      return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(200,{},"User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req,res){
     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

     if (!incomingRefreshToken){
      throw new ApiError(401,"unauthorized request")
     }
     
     try { // try is not necessary here just for safety purpose
      const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
      const user = await User.findById(decodedToken?._id) // when had generated refresh token we had given it id so know we can access id from decoded token
 
       if (!user){   // nhi hai user throw error
       throw new ApiError(401,"Invalid refresh token")
      }
 
      if(incomingRefreshToken !== user?.refreshToken){  // ager match nhi kera to error throw ker do
       throw new ApiError(401,"Refresh token is expired or used")
      }
 
      const options = {
       httpOnly: true,
       secure: true
      }
 
      const{accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newRefreshToken,options)
      .json(
       new ApiResponse(
             200,
             {accessToken,refreshToken: newRefreshToken},
             "Access token refreshed"
       )
      )
     } catch (error) {
      throw new ApiError(401,error?.message || "Invalid refresh toekn")
     }
})

export {
      registerUser,
      loginUser,
      logoutUser,
      refreshAccessToken
 }
