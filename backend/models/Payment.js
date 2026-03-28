import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    provider: {
      type: String,
      default: "razorpay",
    },
    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },
    affiliateCode: {
      type: String,
      default: "",
    },
    commissionAmount: {
      type: Number,
      default: 0,
    },

    platformFeeRate: {
      type: Number,
      default: 20,
    },
    platformFeeAmount: {
      type: Number,
      default: 0,
    },
    adminNetRevenueAmount: {
      type: Number,
      default: 0,
    },
    instructorEarningAmount: {
      type: Number,
      default: 0,
    },

    refundStatus: {
      type: String,
      enum: ["none", "requested", "processed"],
      default: "none",
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);