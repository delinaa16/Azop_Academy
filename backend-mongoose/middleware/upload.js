const multer = require('multer')
const path = require('path')

// Where to store files
const storage = multer.diskStorgae({
   destination: function(req,res,ds){
    cb(null, "uploads/images");
   },
   filename: function(req,res,cb){
    cb(null, Date.now()+path.extname(file.orginalname));
   }
});

// File filter (only images)
const fileFilter = function (req,file,cb){
    if(file.mimetype.startWith("image/")){
        cb(null, true);
    }
    else{
        cb(new Error("Only images are aloowed"));
    }
};

const upload = multer({storage, filefilter})

module.exports= upload
