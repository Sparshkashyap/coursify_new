import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, msg: "All fields required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER, // safer than using user input
      to: process.env.EMAIL_USER,  // 👈 coursify owner email
      subject: "New Contact Message",
      text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

export default router;