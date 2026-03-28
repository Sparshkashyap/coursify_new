import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  requestRefund,
  getMyRefundRequests,
  getAllRefundRequests,
  processRefund,
} from "../controllers/refundController.js";

const router = express.Router();

router.post("/request", protect, allowRoles("student"), requestRefund);
router.get("/my", protect, allowRoles("student"), getMyRefundRequests);
router.get("/admin", protect, allowRoles("admin"), getAllRefundRequests);
router.put("/:id/process", protect, allowRoles("admin"), processRefund);

export default router;