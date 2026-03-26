import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  getCourseReviews,
  upsertCourseReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:courseId", getCourseReviews);
router.post("/:courseId", protect, allowRoles("student"), upsertCourseReview);

export default router;