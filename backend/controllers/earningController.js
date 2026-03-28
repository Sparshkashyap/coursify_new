import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const buildMonthMap = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  });

  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({
      key,
      label: formatter.format(d),
      value: 0,
    });
  }

  return months;
};

export const getInstructorEarningsOverview = async (req, res) => {
  try {
    const instructorId = getUserId(req);

    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const totalCourses = await Course.countDocuments({ instructor: instructorId });

    const payments = await Payment.find({
      instructor: instructorId,
      status: "paid",
    }).select("amount instructorEarningAmount paidAt");

    const totalSales = payments.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalEarnings = payments.reduce(
      (sum, item) => sum + Number(item.instructorEarningAmount || 0),
      0
    );

    const totalTransactions = payments.length;

    const monthMap = buildMonthMap();

    payments.forEach((payment) => {
      if (!payment.paidAt) return;

      const paidAt = new Date(payment.paidAt);
      const key = `${paidAt.getFullYear()}-${String(paidAt.getMonth() + 1).padStart(2, "0")}`;
      const target = monthMap.find((item) => item.key === key);

      if (target) {
        target.value += Number(payment.instructorEarningAmount || 0);
      }
    });

    const chartData = monthMap.map((item) => ({
      month: item.label,
      earnings: Number(item.value.toFixed(2)),
    }));

    return res.json({
      success: true,
      totalCourses,
      totalTransactions,
      totalSales: Number(totalSales.toFixed(2)),
      totalEarnings: Number(totalEarnings.toFixed(2)),
      chartData,
    });
  } catch (error) {
    console.error("INSTRUCTOR EARNINGS OVERVIEW ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};

export const getAdminEarningsOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalStudents,
      totalInstructors,
      totalCourses,
      recentUsers,
      recentCourses,
      payments,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      Course.countDocuments(),
      User.find()
        .select("name role isBlocked createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
      Course.find()
        .populate("instructor", "name")
        .select("title status instructor createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
      Payment.find({ status: "paid" }).select(
        "amount adminNetRevenueAmount platformFeeAmount paidAt student"
      ),
    ]);

    const totalRevenue = payments.reduce(
      (sum, item) => sum + Number(item.adminNetRevenueAmount || 0),
      0
    );

    const totalPayments = payments.length;

    const activeStudentsSet = new Set(
      payments.map((item) => String(item.student)).filter(Boolean)
    );

    const monthMap = buildMonthMap();

    payments.forEach((payment) => {
      if (!payment.paidAt) return;

      const paidAt = new Date(payment.paidAt);
      const key = `${paidAt.getFullYear()}-${String(paidAt.getMonth() + 1).padStart(2, "0")}`;
      const target = monthMap.find((item) => item.key === key);

      if (target) {
        target.value += Number(payment.adminNetRevenueAmount || 0);
      }
    });

    const chartData = monthMap.map((item) => ({
      month: item.label,
      earnings: Number(item.value.toFixed(2)),
    }));

    return res.json({
      success: true,
      overview: {
        totalUsers,
        totalAdmins,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalPayments,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        activeStudents: activeStudentsSet.size,
      },
      chartData,
      recentUsers,
      recentCourses,
    });
  } catch (error) {
    console.error("ADMIN EARNINGS OVERVIEW ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Server Error",
    });
  }
};