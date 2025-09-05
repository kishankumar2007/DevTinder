const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + uniqueSuffix)  //return the file path from temp folder
  }
})

const upload = multer({ storage: storage })

module.exports = { upload }