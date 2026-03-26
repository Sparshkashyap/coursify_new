import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import { generateCourseDescription } from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/generate-course-description",
  protect,
  allowRoles("instructor", "admin"),
  generateCourseDescription
);

export default router;