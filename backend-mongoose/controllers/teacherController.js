const Teacher = require("../models/Teacher");

//CREATE TEACHER
exports.createTeacher = async(req,res)=>{
  try{
    const{name, subject, experience}= req.body;
    const photo = req.file? req.file.filename: ""

  const newTeacher = new Teacher({
    name,
    subject,
    experience,
    photo
  });
  await newTeacher.save()
    res.status(201).json(newTeacher);
  }
  catch(error){
    res.status(400).json({message: error.message})
  }
};

exports.getAllTeachers = async(req,res)=>{
  try{
    const teachers = await Teacher.find();
    res.status(200).json(teachers)
  }
  catch(error){
    res.status(500).json({message:error.message})
  }
}

exports.getTeachersById = async(req,res)=>{
  try{
    const teacher = await Teacher.findById(req.param.id)
    res.status(200).json(teacher)
  }
  catch(error){
    res.status(500).json({message: "Teacher not found"})
  }
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

};















// UPDATE TEACHER
exports.updateTeacher = async (req, res) => {
  try {
    const { name, subject, experience } = req.body;

    const photo = req.file ? req.file.filename : undefined;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { name, subject, experience, ...(photo && { photo }) },
      { new: true }
    );
//photo && { photo }  --   { photo: "alice.jpg" }

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE TEACHER
exports.deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Teacher deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
