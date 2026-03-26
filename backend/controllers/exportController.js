import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Payment from "../models/Payment.js";
import { toCSV } from "../utils/csvExport.js";

const getUserId = (req) => req.user?._id || req.user?.id;

export const exportCourseStudentsCSV = async (req, res) => {
  try {
    const instructorId = getUserId(req);
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    console.log("EXPORT USER:", req.user);
console.log("COURSE INSTRUCTOR:", course.instructor.toString());
console.log("REQUEST USER ID:", String(instructorId));

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructor.toString() !== String(instructorId)) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email")
      .populate("payment");

    const rows = enrollments.map((enrollment) => ({
      studentName: enrollment.student?.name || "",
      studentEmail: enrollment.student?.email || "",
      status: enrollment.status,
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolledAt?.toISOString?.() || "",
      paymentStatus: enrollment.payment?.status || "free",
      amountPaid: enrollment.payment?.amount || 0,
      paymentProvider: enrollment.payment?.provider || "",
    }));

    const csv = toCSV(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${course.title.replace(/\s+/g, "_")}_students.csv"`
    );

    return res.status(200).send(csv);
  } catch (err) {
    console.error("EXPORT CSV ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};