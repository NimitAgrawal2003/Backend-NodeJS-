import multer from "multer"



const storage = multer.diskStorage({       // copy pasted
  destination: function (req, file, cb) {
    cb(null, "./public/temp")       // // save files in ./public/temp folder
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

export const upload = multer({
    storage,
})