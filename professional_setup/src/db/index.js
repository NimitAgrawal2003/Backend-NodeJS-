import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";  // https://chatgpt.com/share/68d287d5-5630-8005-8451-9e0697c5bed5

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch(error){
        console.log("MONGODB connection error",error);
        process.exit(1)
    }
}

export default connectDB