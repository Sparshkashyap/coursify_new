import mongoose from "mongoose";

const appSettingsSchema = new mongoose.Schema(
  {
    commissionPercent: {
      type: Number,
      default: 10,
    },
    supportEmail: {
      type: String,
      default: "support@coursify.com",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    defaultCurrency: {
      type: String,
      default: "INR",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AppSettings", appSettingsSchema);