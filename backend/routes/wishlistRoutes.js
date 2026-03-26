import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import {
  getMyWishlist,
  toggleWishlistCourse,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.use(protect, allowRoles("student"));

router.get("/", getMyWishlist);
router.post("/toggle", toggleWishlistCourse);

export default router;