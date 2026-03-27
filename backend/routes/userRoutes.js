import express from "express";
import protect from "../middleware/authMiddleware.js";
import { uploadProfileImage } from "../middleware/uploadMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
  removeMyProfileAvatar,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/profile", protect, uploadProfileImage.single("avatar"), updateMyProfile);
router.delete("/profile/avatar", protect, removeMyProfileAvatar);

export default router;