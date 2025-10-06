import mongoose from "mongoose";      
// import momgoose, { Schema } from "mongoose";   
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"    

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true   // because by using index it helps in searching field 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        avatar: {
            type: String,    // cloudinary url 
            required: true
        },
        coverImage:{
            type: String,  // cloudinary url
        },
        watchHistory : [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
            }
        ],
        password:{
            type: String,
            required: [true,"Password is required"]
        },
        refreshToken: {
            type: String
        }
},{timestamps:true}
);

// pre middleware functions are executed one after another , when each middleware calls next
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){     //  isModified to check if password is modified or not , here if
        return next();                    // password is not modified then return next
    }
    this.password = await bcrypt.hash(this.password,10)  // bcrypt helps to hash password
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){      // here we added a method called isPasswordCorrect we can give different name also to it
      return await bcrypt.compare(password, this.password)       // it checks whether the password is same or not and return true or false
}               

userSchema.method.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.method.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
