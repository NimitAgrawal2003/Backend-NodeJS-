import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler( async ( req , res )=> {
    res.status(200).json({                 // json response send
        message: "chai aur code"
    })
})


export { registerUser }