import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  getInstructorEarningsOverview,
  getAdminEarningsOverview,
} from "../controllers/earningController.js";

const router = express.Router();

router.get(
  "/instructor/overview",
  protect,
  allowRoles("instructor"),
  getInstructorEarningsOverview
);

router.get(
  "/admin/overview",
  protect,
  allowRoles("admin"),
  getAdminEarningsOverview
);

export default router;