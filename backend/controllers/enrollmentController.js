import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const enrollCourse = async (req,res)=>{
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if(!course) return res.status(404).json({success:false,message:"Course not found"});

  const enrollment = await Enrollment.create({
    user:req.user._id,
    course:course._id,
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000*60*60*24*30*6) // 6 months
  });
  
  course.students.push(req.user._id);
  await course.save();

  res.json({success:true,enrollment});
}