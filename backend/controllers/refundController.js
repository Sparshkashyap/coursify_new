import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Wallet from "../models/Wallet.js";

const getUserId = (req) => req.user?._id || req.user?.id;

export const requestRefund = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const { paymentId } = req.body;

    const payment = await Payment.findOne({
      _id: paymentId,
      student: studentId,
      status: "paid",
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Eligible payment not found",
      });
    }

    payment.refundStatus = "requested";
    await payment.save();

    return res.json({
      success: true,
      message: "Refund requested successfully",
      payment,
    });
  } catch (error) {
    console.error("REQUEST REFUND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const getMyRefundRequests = async (req, res) => {
  try {
    const studentId = getUserId(req);

    const refunds = await Payment.find({
      student: studentId,
      refundStatus: { $in: ["requested", "processed"] },
    })
      .populate("course", "title image")
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      refunds,
    });
  } catch (error) {
    console.error("GET MY REFUNDS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const getAllRefundRequests = async (req, res) => {
  try {
    const refunds = await Payment.find({
      refundStatus: { $in: ["requested", "processed"] },
    })
      .populate("student", "name email")
      .populate("course", "title")
      .populate("instructor", "name email")
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      refunds,
    });
  } catch (error) {
    console.error("GET ALL REFUNDS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const processRefund = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.refundStatus !== "requested") {
      return res.status(400).json({
        success: false,
        message: "Refund is not in requested state",
      });
    }

    payment.refundStatus = "processed";
    payment.refundAmount = Number(payment.amount || 0);
    payment.status = "refunded";

    await payment.save();

    const wallet = await Wallet.findOne({ instructor: payment.instructor });
    if (wallet) {
      wallet.totalEarnings = Number(
        Math.max(
          Number(wallet.totalEarnings || 0) -
            Number(payment.instructorEarningAmount || 0),
          0
        ).toFixed(2)
      );

      wallet.availableBalance = Number(
        Math.max(
          Number(wallet.availableBalance || 0) -
            Number(payment.instructorEarningAmount || 0),
          0
        ).toFixed(2)
      );

      await wallet.save();
    }

    await Enrollment.findOneAndUpdate(
      { student: payment.student, course: payment.course },
      { status: "inactive" }
    );

    const course = await Course.findById(payment.course);
    if (course) {
      course.students = (course.students || []).filter(
        (id) => id.toString() !== String(payment.student)
      );
      await course.save();
    }

    return res.json({
      success: true,
      message: "Refund processed successfully",
      payment,
    });
  } catch (error) {
    console.error("PROCESS REFUND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};