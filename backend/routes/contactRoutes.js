import express from "express";
import { sendEmail } from "../utils/sendEmail.js";
import { queueEmail } from "../jobs/emailJobs.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    await queueEmail({
      to: process.env.EMAIL_FROM, // admin email
      subject: "New Contact Message - Coursify",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("CONTACT EMAIL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

export default router;