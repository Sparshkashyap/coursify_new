import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import affiliateRoutes from "./routes/affiliateRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import studentAIRoutes from "./routes/studentAIRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import courseAssistantRoutes from "./routes/courseAssistantRoutes.js";
import subscriptionRoutes from './routes/subscriptionRoutes.js'
import userRoutes from './routes/userRoutes.js';

const app = express();

connectDB();

app.use(helmet());

// app.use(
//   helmet({
//     crossOriginEmbedderPolicy: false,
//     contentSecurityPolicy: false,
//   })
// );

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/contact", contactRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/courses", courseRoutes);
app.use("/uploads", uploadRoutes);
app.use("/payments", paymentRoutes);
app.use("/instructor", instructorRoutes);
app.use("/affiliates", affiliateRoutes);
app.use("/ai", aiRoutes);
app.use("/exports", exportRoutes);
app.use("/reviews", reviewRoutes);
app.use("/student", studentRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/student-ai", studentAIRoutes);
app.use("/certificates", certificateRoutes);
app.use("/course-assistant", courseAssistantRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/users",userRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});