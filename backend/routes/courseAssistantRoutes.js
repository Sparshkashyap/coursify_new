import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  generateCourseQuiz,
  askAssistantInCourse,
  getCourseSummary,
  getCourseNextLessonGuidance,
} from "../controllers/courseAssistantController.js";

const router = express.Router();

router.use(protect, allowRoles("student"));

router.post("/quiz/:courseId", generateCourseQuiz);
router.post("/chat/:courseId", askAssistantInCourse);
router.get("/summary/:courseId", getCourseSummary);
router.get("/next-lesson/:courseId", getCourseNextLessonGuidance);

export default router;