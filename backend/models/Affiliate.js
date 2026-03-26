import mongoose from "mongoose";

const affiliateSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    commissionRate: {
      type: Number,
      default: 10,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    totalConversions: {
      type: Number,
      default: 0,
    },
    totalCommission: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Affiliate", affiliateSchema);