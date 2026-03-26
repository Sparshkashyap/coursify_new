import express from "express";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import { getCertificateById } from "../controllers/certificateController.js";

const router = express.Router();

router.get("/:id", protect, allowRoles("student"), getCertificateById);

export default router;