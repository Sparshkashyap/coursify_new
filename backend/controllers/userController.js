import User from "../models/User.js";

export const makeInstructor = async (req,res)=>{

  try{

    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role:"instructor" },
      { new:true }
    );

    res.json({
      success:true,
      message:"User promoted to instructor",
      user
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Server error"
    });

  }

};