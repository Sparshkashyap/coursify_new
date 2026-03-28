import Wallet from "../models/Wallet.js";
import PayoutRequest from "../models/PayoutRequest.js";
import Payment from "../models/Payment.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const getOrCreateWallet = async (instructorId) => {
  let wallet = await Wallet.findOne({ instructor: instructorId });

  if (!wallet) {
    wallet = await Wallet.create({
      instructor: instructorId,
      totalEarnings: 0,
      availableBalance: 0,
      pendingPayout: 0,
      totalWithdrawn: 0,
    });
  }

  return wallet;
};

const syncWalletFromPayments = async (instructorId) => {
  const wallet = await getOrCreateWallet(instructorId);

  const paidPayments = await Payment.find({
    instructor: instructorId,
    status: "paid",
  }).select("instructorEarningAmount");

  const totalEarnings = paidPayments.reduce(
    (sum, payment) => sum + Number(payment.instructorEarningAmount || 0),
    0
  );

  const pendingRequests = await PayoutRequest.find({
    instructor: instructorId,
    status: "pending",
  }).select("amount");

  const pendingPayout = pendingRequests.reduce(
    (sum, request) => sum + Number(request.amount || 0),
    0
  );

  const approvedOrPaidRequests = await PayoutRequest.find({
    instructor: instructorId,
    status: { $in: ["approved", "paid"] },
  }).select("amount processedAt");

  const totalWithdrawn = approvedOrPaidRequests.reduce(
    (sum, request) => sum + Number(request.amount || 0),
    0
  );

  const lastProcessed = approvedOrPaidRequests
    .filter((item) => item.processedAt)
    .sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt))[0];

  wallet.totalEarnings = Number(totalEarnings.toFixed(2));
  wallet.pendingPayout = Number(pendingPayout.toFixed(2));
  wallet.totalWithdrawn = Number(totalWithdrawn.toFixed(2));
  wallet.availableBalance = Number(
    Math.max(totalEarnings - pendingPayout - totalWithdrawn, 0).toFixed(2)
  );
  wallet.lastPayoutAt = lastProcessed?.processedAt || null;

  await wallet.save();

  return wallet;
};

export const getInstructorWallet = async (req, res) => {
  try {
    const instructorId = getUserId(req);

    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const wallet = await syncWalletFromPayments(instructorId);

    const recentPayouts = await PayoutRequest.find({ instructor: instructorId })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.json({
      success: true,
      wallet,
      recentPayouts,
    });
  } catch (error) {
    console.error("GET INSTRUCTOR WALLET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const createPayoutRequest = async (req, res) => {
  try {
    const instructorId = getUserId(req);
    const { amount, note = "" } = req.body;

    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const requestAmount = Number(amount);

    if (!Number.isFinite(requestAmount) || requestAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payout amount is required",
      });
    }

    const wallet = await syncWalletFromPayments(instructorId);

    if (requestAmount > Number(wallet.availableBalance || 0)) {
      return res.status(400).json({
        success: false,
        message: "Requested amount exceeds available balance",
      });
    }

    const existingPending = await PayoutRequest.findOne({
      instructor: instructorId,
      status: "pending",
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending payout request",
      });
    }

    const payoutRequest = await PayoutRequest.create({
      instructor: instructorId,
      wallet: wallet._id,
      amount: requestAmount,
      note: note?.trim() || "",
      status: "pending",
    });

    const updatedWallet = await syncWalletFromPayments(instructorId);

    return res.status(201).json({
      success: true,
      message: "Payout request created successfully",
      payoutRequest,
      wallet: updatedWallet,
    });
  } catch (error) {
    console.error("CREATE PAYOUT REQUEST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const getInstructorPayoutRequests = async (req, res) => {
  try {
    const instructorId = getUserId(req);

    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payoutRequests = await PayoutRequest.find({ instructor: instructorId })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      payoutRequests,
    });
  } catch (error) {
    console.error("GET INSTRUCTOR PAYOUT REQUESTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const getAdminPayoutRequests = async (req, res) => {
  try {
    const payoutRequests = await PayoutRequest.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      payoutRequests,
    });
  } catch (error) {
    console.error("GET ADMIN PAYOUT REQUESTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const approvePayoutRequest = async (req, res) => {
  try {
    const adminId = getUserId(req);
    const { id } = req.params;
    const { adminNote = "" } = req.body;

    const payoutRequest = await PayoutRequest.findById(id);

    if (!payoutRequest) {
      return res.status(404).json({
        success: false,
        message: "Payout request not found",
      });
    }

    if (payoutRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending payout requests can be approved",
      });
    }

    payoutRequest.status = "approved";
    payoutRequest.adminNote = adminNote?.trim() || "";
    payoutRequest.processedBy = adminId;
    payoutRequest.processedAt = new Date();

    await payoutRequest.save();
    await syncWalletFromPayments(payoutRequest.instructor);

    return res.json({
      success: true,
      message: "Payout request approved",
      payoutRequest,
    });
  } catch (error) {
    console.error("APPROVE PAYOUT REQUEST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const rejectPayoutRequest = async (req, res) => {
  try {
    const adminId = getUserId(req);
    const { id } = req.params;
    const { adminNote = "" } = req.body;

    const payoutRequest = await PayoutRequest.findById(id);

    if (!payoutRequest) {
      return res.status(404).json({
        success: false,
        message: "Payout request not found",
      });
    }

    if (payoutRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending payout requests can be rejected",
      });
    }

    payoutRequest.status = "rejected";
    payoutRequest.adminNote = adminNote?.trim() || "";
    payoutRequest.processedBy = adminId;
    payoutRequest.processedAt = new Date();

    await payoutRequest.save();
    await syncWalletFromPayments(payoutRequest.instructor);

    return res.json({
      success: true,
      message: "Payout request rejected",
      payoutRequest,
    });
  } catch (error) {
    console.error("REJECT PAYOUT REQUEST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};