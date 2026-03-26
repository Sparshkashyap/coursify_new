import express from "express";

import { signup, login,forgotPassword,resetPassword,googleLogin } from "../controllers/authController.js";

import {
  signupValidation,
  loginValidation
} from "../middleware/authValidation.js";

const router = express.Router();

router.post("/signup", signupValidation, signup);

router.post("/login", loginValidation, login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/google-login",googleLogin);

export default router;