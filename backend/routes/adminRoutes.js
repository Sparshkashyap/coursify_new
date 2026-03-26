import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  toggleUserBlock,
  getAllCoursesAdmin,
  updateCourseStatus,
  deleteCourseAdmin,
  getAllPaymentsAdmin,
  getAppSettings,
  updateAppSettings,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/overview", getAdminOverview);

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/block", toggleUserBlock);

router.get("/courses", getAllCoursesAdmin);
router.patch("/courses/:id/status", updateCourseStatus);
router.delete("/courses/:id", deleteCourseAdmin);

router.get("/payments", getAllPaymentsAdmin);

router.get("/settings", getAppSettings);
router.put("/settings", updateAppSettings);

export default router;