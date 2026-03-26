import crypto from "crypto";
import Affiliate from "../models/Affiliate.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const generateCode = () => {
  return `REF${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const generateUniqueAffiliateCode = async () => {
  let code = generateCode();
  let exists = await Affiliate.findOne({ code });

  while (exists) {
    code = generateCode();
    exists = await Affiliate.findOne({ code });
  }

  return code;
};

export const getOrCreateAffiliate = async (req, res) => {
  try {
    const instructorId = getUserId(req);

    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    let affiliate = await Affiliate.findOne({ instructor: instructorId });

    if (!affiliate) {
      const code = await generateUniqueAffiliateCode();

      affiliate = await Affiliate.create({
        instructor: instructorId,
        code,
        commissionRate: 10,
        totalClicks: 0,
        totalConversions: 0,
        totalCommission: 0,
        isActive: true,
      });
    }

    return res.json({
      success: true,
      affiliate,
    });
  } catch (err) {
    console.error("GET OR CREATE AFFILIATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};

export const getMyAffiliate = async (req, res) => {
  try {
    const instructorId = getUserId(req);

    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    let affiliate = await Affiliate.findOne({ instructor: instructorId });

    if (!affiliate) {
      const code = await generateUniqueAffiliateCode();

      affiliate = await Affiliate.create({
        instructor: instructorId,
        code,
        commissionRate: 10,
        totalClicks: 0,
        totalConversions: 0,
        totalCommission: 0,
        isActive: true,
      });
    }

    return res.json({
      success: true,
      affiliate,
    });
  } catch (err) {
    console.error("GET MY AFFILIATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};

export const trackAffiliateClick = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Affiliate code is required",
      });
    }

    const affiliate = await Affiliate.findOne({
      code,
      isActive: true,
    });

    if (!affiliate) {
      return res.status(404).json({
        success: false,
        message: "Invalid affiliate code",
      });
    }

    affiliate.totalClicks += 1;
    await affiliate.save();

    return res.json({
      success: true,
      message: "Affiliate click tracked",
    });
  } catch (err) {
    console.error("TRACK AFFILIATE CLICK ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};