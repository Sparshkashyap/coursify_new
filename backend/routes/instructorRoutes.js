import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  getInstructorOverview,
  getInstructorEarnings,
} from "../controllers/instructorAnalyticsController.js";

const router = express.Router();

router.get(
  "/overview",
  protect,
  allowRoles("instructor", "admin"),
  getInstructorOverview
);

router.get(
  "/earnings",
  protect,
  allowRoles("instructor", "admin"),
  getInstructorEarnings
);

export default router;