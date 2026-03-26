import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const buildInstructorAnalytics = async (instructorId) => {
  const courses = await Course.find({ instructor: instructorId });
  const courseIds = courses.map((c) => c._id);

  const enrollments = await Enrollment.find({
    course: { $in: courseIds },
  });

  const payments = await Payment.find({
    instructor: instructorId,
    status: "paid",
  }).sort({ createdAt: 1 });

  const totalStudents = enrollments.length;
  const totalCourses = courses.length;
  const totalEarnings = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  const monthlyMap = {};

  payments.forEach((payment) => {
    const date = new Date(payment.paidAt || payment.createdAt);
    const key = date.toLocaleString("en-US", { month: "short" });
    monthlyMap[key] = (monthlyMap[key] || 0) + (Number(payment.amount) || 0);
  });

  const chartData = Object.entries(monthlyMap).map(([month, earnings]) => ({
    month,
    earnings,
  }));

  return {
    totalStudents,
    totalCourses,
    totalEarnings,
    totalSales: payments.length,
    chartData,
  };
};

export const getInstructorOverview = async (req, res) => {
  try {
    const instructorId = getUserId(req);

    const data = await buildInstructorAnalytics(instructorId);

    return res.json({
      success: true,
      overview: {
        totalStudents: data.totalStudents,
        totalCourses: data.totalCourses,
        totalEarnings: data.totalEarnings,
        totalSales: data.totalSales,
      },
      chartData: data.chartData,
    });
  } catch (err) {
    console.error("INSTRUCTOR OVERVIEW ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};

export const getInstructorEarnings = async (req, res) => {
  try {
    const instructorId = getUserId(req);

    const data = await buildInstructorAnalytics(instructorId);

    return res.json({
      success: true,
      totalEarnings: data.totalEarnings,
      totalCourses: data.totalCourses,
      totalStudents: data.totalStudents,
      totalSales: data.totalSales,
      chartData: data.chartData,
      summary: {
        totalEarnings: data.totalEarnings,
        totalCourses: data.totalCourses,
        totalStudents: data.totalStudents,
        totalSales: data.totalSales,
        chartData: data.chartData,
      },
    });
  } catch (err) {
    console.error("INSTRUCTOR EARNINGS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};