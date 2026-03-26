import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", protect, allowRoles("student"), createRazorpayOrder);
router.post("/verify", protect, allowRoles("student"), verifyRazorpayPayment);

export default router;