import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import { exportCourseStudentsCSV } from "../controllers/exportController.js";

const router = express.Router();

router.get("/courses/:courseId/students-csv", protect, allowRoles("instructor", "admin"), exportCourseStudentsCSV);

export default router;

