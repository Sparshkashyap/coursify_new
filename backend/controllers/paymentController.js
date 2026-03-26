import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import Affiliate from "../models/Affiliate.js";

const getUserId = (req) => req.user?._id || req.user?.id;

export const createRazorpayOrder = async (req, res) => {
  try {
    const { courseId, affiliateCode = "" } = req.body;
    const studentId = getUserId(req);

    console.log("CREATE ORDER BODY:", req.body);
    console.log("CREATE ORDER USER:", req.user);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course id is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.status && course.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "This course is not available for purchase",
      });
    }

    if (course.isFree || Number(course.price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "This course is free. Payment order not required.",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const amountInPaise = Math.round(Number(course.price) * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course price",
      });
    }

    const receipt = `c_${course._id.toString().slice(-8)}_${Date.now()
      .toString()
      .slice(-10)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        courseId: String(course._id),
        studentId: String(studentId),
        affiliateCode: affiliateCode || "",
      },
    });

    await Payment.create({
      student: studentId,
      course: course._id,
      instructor: course.instructor,
      amount: Number(course.price),
      currency: "INR",
      provider: "razorpay",
      razorpayOrderId: order.id,
      affiliateCode: affiliateCode || "",
      status: "created",
    });

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      },
      course: {
        _id: course._id,
        title: course.title,
        price: course.price,
        image: course.image || "",
      },
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR FULL:", err);
    return res.status(500).json({
      success: false,
      message: err?.error?.description || err?.message || "Server Error",
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const studentId = getUserId(req);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    console.log("VERIFY PAYMENT BODY:", req.body);
    console.log("VERIFY PAYMENT USER:", req.user);

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

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

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    if (payment.status === "paid") {
      return res.json({
        success: true,
        message: "Payment already verified",
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.paidAt = new Date();

    if (payment.affiliateCode) {
      const affiliate = await Affiliate.findOne({
        code: payment.affiliateCode,
        isActive: true,
      });

      if (affiliate) {
        const commission = Math.round(
          (payment.amount * affiliate.commissionRate) / 100
        );
        payment.commissionAmount = commission;
        affiliate.totalConversions += 1;
        affiliate.totalCommission += commission;
        await affiliate.save();
      }
    }

    await payment.save();

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: payment.course,
    });

    if (!existingEnrollment) {
      await Enrollment.create({
        student: studentId,
        course: payment.course,
        payment: payment._id,
        status: "active",
        totalLessons: 10,
        completedLessons: 0,
        progress: 0,
      });
    }

    const course = await Course.findById(payment.course);

    if (course) {
      const alreadyInStudents = course.students?.some(
        (id) => id.toString() === String(studentId)
      );

      if (!alreadyInStudents) {
        course.students.push(studentId);
        await course.save();
      }
    }

    return res.json({
      success: true,
      message: "Payment verified and enrollment created",
    });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR FULL:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};