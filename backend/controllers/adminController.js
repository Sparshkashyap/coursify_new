import User from "../models/User.js";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import AppSettings from "../models/AppSettings.js";

export const getAdminOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalStudents,
      totalInstructors,
      totalCourses,
      totalPayments,
      totalRevenue,
      activeStudents,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      Course.countDocuments(),
      Payment.countDocuments({ status: "paid" }),
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      User.countDocuments({ role: "student", isBlocked: false }),
    ]);

    const paymentChartAgg = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          earnings: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = paymentChartAgg.map((item) => ({
      month: monthNames[item._id - 1],
      earnings: item.earnings,
    }));

    const recentUsers = await User.find()
      .select("name email role isBlocked createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentCourses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      overview: {
        totalUsers,
        totalAdmins,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeStudents,
      },
      chartData,
      recentUsers,
      recentCourses,
    });
  } catch (err) {
    console.error("ADMIN OVERVIEW ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search = "", role = "all" } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role !== "all") {
      query.role = role;
    }

    const users = await User.find(query)
      .select("name email role isBlocked createdAt")
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["student", "instructor", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("name email role isBlocked createdAt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user, message: "User role updated" });
  } catch (err) {
    console.error("UPDATE USER ROLE ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email role isBlocked createdAt"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      user,
      message: user.isBlocked ? "User blocked" : "User unblocked",
    });
  } catch (err) {
    console.error("TOGGLE USER BLOCK ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllCoursesAdmin = async (req, res) => {
  try {
    const { search = "", status = "all" } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (status !== "all") {
      query.status = status;
    }

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (err) {
    console.error("GET ADMIN COURSES ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "published", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, course, message: "Course status updated" });
  } catch (err) {
    console.error("UPDATE COURSE STATUS ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteCourseAdmin = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (err) {
    console.error("DELETE COURSE ADMIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllPaymentsAdmin = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("student", "name email")
      .populate("instructor", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (err) {
    console.error("GET ADMIN PAYMENTS ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAppSettings = async (req, res) => {
  try {
    let settings = await AppSettings.findOne();

    if (!settings) {
      settings = await AppSettings.create({});
    }

    res.json({ success: true, settings });
  } catch (err) {
    console.error("GET SETTINGS ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateAppSettings = async (req, res) => {
  try {
    let settings = await AppSettings.findOne();

    if (!settings) {
      settings = await AppSettings.create({});
    }

    settings.commissionPercent =
      req.body.commissionPercent ?? settings.commissionPercent;
    settings.supportEmail = req.body.supportEmail ?? settings.supportEmail;
    settings.maintenanceMode =
      req.body.maintenanceMode ?? settings.maintenanceMode;
    settings.defaultCurrency =
      req.body.defaultCurrency ?? settings.defaultCurrency;

    await settings.save();

    res.json({ success: true, settings, message: "Settings updated" });
  } catch (err) {
    console.error("UPDATE SETTINGS ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};