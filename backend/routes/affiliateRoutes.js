import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  getMyAffiliate,
  getOrCreateAffiliate,
  trackAffiliateClick,
} from "../controllers/affiliateController.js";

const router = express.Router();

router.get("/me", protect, allowRoles("instructor"), getMyAffiliate);
router.get("/my", protect, allowRoles("instructor"), getOrCreateAffiliate);
router.post("/track-click", trackAffiliateClick);

export default router;