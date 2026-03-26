import User from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { resetPasswordTemplate } from "../emails/resetPasswordTemplate.js";
import { OAuth2Client } from "google-auth-library";



/* =========================
   SIGNUP
========================= */

export const signup = async (req,res)=>{

  try{

    const { name,email,password,role } = req.body;

    if(!name || !email || !password){
      return res.status(400).json({
        success:false,
        message:"All fields are required"
      });
    }

    const userExists = await User.findOne({email});

    if(userExists){
      return res.status(400).json({
        success:false,
        message:"User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const allowedRole =
      role === "instructor" ? "instructor" : "student";

    const user = await User.create({
      name,
      email,
      password:hashedPassword,
      role:allowedRole || "student"
    });

    res.status(201).json({
      success:true,
      message:"User created successfully"
    });

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Server error"
    });

  }

};



/* =========================
   LOGIN
========================= */

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};



/* =========================
   FORGOT PASSWORD
========================= */

export const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;

    // ⭐ generate HTML email
    const html = resetPasswordTemplate(resetUrl, user.name);

    // ⭐ send email
    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html
    });

    res.json({
      success: true,
      message: "Password reset link sent to your email"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error sending email"
    });

  }

};



/* =========================
   RESET PASSWORD
========================= */

export const resetPassword = async (req, res) => {

  try {

    const { token } = req.params;
    const { password } = req.body;
   
   
    const user = await User.findOne({

     resetPasswordToken: token,
     resetPasswordExpire: { $gt: Date.now() }
     

    });
 
    // console.log(user);

    if (!user) {
       
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
     
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
  console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};



//GOOGLE O AUTH
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = async (req,res)=>{

  try{

    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if(!user){

      user = await User.create({
        name,
        email,
        googleId: sub,
        avatar: picture
      });

    }

    const jwtToken = generateToken(user._id);

    res.json({
      success:true,
      token:jwtToken,
      user
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:"Google login failed"
    });

  }

};





