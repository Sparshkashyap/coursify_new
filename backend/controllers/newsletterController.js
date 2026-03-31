import Newsletter from "../models/Newsletter.js";
import { sendEmail } from "../utils/sendEmail.js";
import { queueEmail } from "../jobs/emailJobs.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existing = await Newsletter.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already subscribed",
      });
    }

    await Newsletter.create({
      email: email.toLowerCase(),
    });

    res.json({
      success: true,
      message: "Subscribed successfully",
    });

    // send email in background
    await queueEmail({
      to: email,
      subject: "Welcome to Coursify Newsletter",
      html: `
        <h2>Welcome to Coursify</h2>
        <p>Thanks for subscribing to our newsletter.</p>
      `,
    }).catch((err) => {
      console.error("Newsletter email error:", err);
    });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    res.status(500).json({
      success: false,
      message: "Subscription failed",
    });
  }
};