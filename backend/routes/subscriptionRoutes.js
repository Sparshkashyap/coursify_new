import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getPlans,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  getMySubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/plans", getPlans);
router.get("/my", protect, getMySubscription);
router.post("/create-order", protect, createSubscriptionOrder);
router.post("/verify", protect, verifySubscriptionPayment);

export default router;