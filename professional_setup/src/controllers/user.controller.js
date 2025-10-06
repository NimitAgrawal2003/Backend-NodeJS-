import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
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

      if (!avatarLocalPath) {
            throw new ApiError(400 , "Avatar file is required")
      }

     const avatar = await uploadOnCloudinary(avatarLocalPath)
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
      "-password -refreshToken"                                  // if created remove it's password and refreshtoken field from response
     )

     if (!createdUser){
      throw new ApiError(500,"Something went wrong while registering the user")
     }

     return res.status(201).json(
      new ApiResponse(200 , createdUser , "User registered Successfully")
     )
}) 


export { registerUser }