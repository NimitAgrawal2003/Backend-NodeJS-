import dotenv from "dotenv"

import connectDB from "./db/index.js"
import app from "./app.js"

dotenv.config({
    path: './env'
})

connectDB()  // when db is connected it returns a promise 
.then(()=>{
    app.listen(process.env.PORT || 8000 , () =>{
        console.log(`server is running at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("Mongo db connection failled !!! ",err);
})