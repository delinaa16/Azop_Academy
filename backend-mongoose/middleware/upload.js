const multer = require('multer')
const path = require('path')

// Where to store files
const storage = multer.diskStorage({
   destination: function(req,file,cb){
    cb(null, "uploads/images");
   },
   filename: function(req,file,cb){
    cb(null, Date.now()+path.extname(file.originalname));
   }
});

// File filter (only images)
const fileFilter = function (req,file,cb){
    if(file.mimetype.startsWith("image/")){
        cb(null, true);
    }
    else{
        cb(new Error("Only images are allowed"));
    }
};

const upload = multer({storage, fileFilter})

module.exports= upload
