import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Subscription from "../models/Subscription.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const PLAN_PRICING = {
  free: {
    monthly: 0,
    yearly: 0,
  },
  pro: {
    monthly: 1900,   // ₹19.00 equivalent if you want demo values
    yearly: 19000,   // ₹190.00
  },
  premium: {
    monthly: 4900,   // ₹49.00
    yearly: 49000,   // ₹490.00
  },
};

// If you want real rupee values instead, use:
// pro monthly 1900 => ₹19
// premium monthly 4900 => ₹49
// Razorpay amount is in paise.

export const getPlans = async (req, res) => {
  try {
    return res.json({
      success: true,
      plans: [
        {
          name: "Free",
          key: "free",
          monthly: 0,
          yearly: 0,
          features: ["Basic courses", "Community access", "Explorer curiosity"],
        },
        {
          name: "Pro",
          key: "pro",
          monthly: 19,
          yearly: 190,
          features: ["All courses", "Certificates", "Priority support"],
        },
        {
          name: "Premium",
          key: "premium",
          monthly: 49,
          yearly: 490,
          features: ["All features", "Mentorship", "Exclusive content"],
        },
      ],
    });
  } catch (err) {
    console.error("GET PLANS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};

export const createSubscriptionOrder = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { plan, billingCycle } = req.body;

    if (!plan || !billingCycle) {
      return res.status(400).json({
        success: false,
        message: "Plan and billing cycle are required",
      });
    }

    if (!PLAN_PRICING[plan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    if (!["monthly", "yearly"].includes(billingCycle)) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing cycle",
      });
    }

    const amount = PLAN_PRICING[plan][billingCycle];

    if (plan === "free" || amount <= 0) {
      const existingFree = await Subscription.findOne({
        user: userId,
        plan: "free",
        status: "active",
      });

      if (!existingFree) {
        await Subscription.create({
          user: userId,
          plan: "free",
          billingCycle,
          amount: 0,
          status: "active",
          startsAt: new Date(),
          endsAt: null,
          provider: "razorpay",
        });
      }

      return res.json({
        success: true,
        freePlan: true,
        message: "Free plan activated",
      });
    }

    const receipt = `sub_${plan}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        userId: String(userId),
        plan,
        billingCycle,
      },
    });

    await Subscription.create({
      user: userId,
      plan,
      billingCycle,
      amount: amount / 100,
      currency: "INR",
      provider: "razorpay",
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      plan,
      billingCycle,
      amount,
    });
  } catch (err) {
    console.error("CREATE SUBSCRIPTION ORDER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.error?.description || err?.message || "Server Error",
    });
  }
};

export const verifySubscriptionPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const subscription = await Subscription.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription record not found",
      });
    }

    if (subscription.status === "active") {
      return res.json({
        success: true,
        message: "Subscription already activated",
      });
    }

    const start = new Date();
    const end = new Date(start);

    if (subscription.billingCycle === "monthly") {
      end.setMonth(end.getMonth() + 1);
    } else {
      end.setFullYear(end.getFullYear() + 1);
    }

    subscription.razorpayPaymentId = razorpay_payment_id;
    subscription.razorpaySignature = razorpay_signature;
    subscription.status = "active";
    subscription.startsAt = start;
    subscription.endsAt = end;

    await subscription.save();

    return res.json({
      success: true,
      message: "Subscription activated successfully",
      subscription,
    });
  } catch (err) {
    console.error("VERIFY SUBSCRIPTION PAYMENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};

export const getMySubscription = async (req, res) => {
  try {
    const userId = getUserId(req);

    const subscription = await Subscription.findOne({
      user: userId,
      status: "active",
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      subscription: subscription || null,
    });
  } catch (err) {
    console.error("GET MY SUBSCRIPTION ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};