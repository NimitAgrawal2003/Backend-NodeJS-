import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "16kb"}))   
app.use(express.urlencoded({extended:true , limit: "16kb"}))
app.use(express.static("public"))               // these all are basic configuration
app.use(cookieParser())

// routes import
import userRouter from './routes/user.routes.js'  // we can give our name when only the export is default

// routes declaration
app.use("/api/v1/users",userRouter)
//http://localhost:8000/api/v1/users/register

export default app