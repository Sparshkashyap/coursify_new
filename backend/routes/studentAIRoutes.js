import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import { getAIRecommendedCourses } from "../controllers/studentAIController.js";

const router = express.Router();

router.post(
  "/recommendation",
  protect,
  allowRoles("student"),
  getAIRecommendedCourses
);

export default router;