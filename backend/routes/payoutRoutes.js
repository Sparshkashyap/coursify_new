import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  getInstructorWallet,
  createPayoutRequest,
  getInstructorPayoutRequests,
  getAdminPayoutRequests,
  approvePayoutRequest,
  rejectPayoutRequest,
} from "../controllers/payoutController.js";

const router = express.Router();

router.get("/wallet", protect, allowRoles("instructor"), getInstructorWallet);
router.post("/request", protect, allowRoles("instructor"), createPayoutRequest);
router.get("/my-requests", protect, allowRoles("instructor"), getInstructorPayoutRequests);

router.get("/admin/requests", protect, allowRoles("admin"), getAdminPayoutRequests);
router.put("/admin/:id/approve", protect, allowRoles("admin"), approvePayoutRequest);
router.put("/admin/:id/reject", protect, allowRoles("admin"), rejectPayoutRequest);

export default router;