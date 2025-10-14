import { Router } from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([        // upload from multer middleware 
        {                       // takes array of objects
            name: "avatar",
            maxCount: 1          // file to be accepted
        },
        {
            name: "coverImage",
            maxCount: 1

        }
    ]),   // accept array
    registerUser
)   //  multer jata hua muj sa mil ka jana

router.route("/login").post(loginUser)

//secured routess
router.route("/logout").post(verifyJWT,logoutUser)  // verifyJWT is middleware here

export default router