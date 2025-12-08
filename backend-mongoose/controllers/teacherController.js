const Teacher =  require('../models/Teachers')

const getTeachers = async(req,res)=>{
    try{
        const teachers = await Teachers.find();
        res.json(teachers)
    }
    catch(error){
        res.status(500).json({message:errormessage});
    }
};

const addTeachers = async(req,res)=>{
        try{
    const {name, subject, experience} = req.body()
    const photo = req.file? req.file.filename : "";
   
        const newTeachers = new Teachers({name, subject, experience, photo})
        await newTeachers.save()
        res.status(201).json(newTeachers)
     }
        catch(error){
        res.status(400).json({message: error.message});
    }
};

module.exports(getTeachers, addTeachers)
