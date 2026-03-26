import express from "express";
import {
  createCourse,
  getAllCourses,
  getMyCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  getCourseCategories,
} from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/categories/list", getCourseCategories);
router.get("/my", protect, getMyCourses);
router.get("/:id", protect, getSingleCourse);

router.post("/", protect, createCourse);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

export default router;