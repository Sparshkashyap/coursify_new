import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  getStudentDashboard,
  enrollInFreeCourse,
  getMyCourseAccess,
  completeCourseAndIssueCertificate,
  getMyCertificates
} from "../controllers/studentController.js";

const router = express.Router();

router.use(protect, allowRoles("student"));

router.get("/dashboard", getStudentDashboard);
router.post("/enroll-free", enrollInFreeCourse);
router.get("/course-access/:courseId", getMyCourseAccess);
router.post("/complete-course/:courseId", protect, allowRoles("student"), completeCourseAndIssueCertificate);
router.get("/certificates", protect, allowRoles("student"), getMyCertificates);

export default router;