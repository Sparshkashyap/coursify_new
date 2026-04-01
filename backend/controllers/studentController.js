import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Certificate from "../models/Certificate.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const calculateExpiryDate = (value, unit, baseDate = new Date()) => {
  if (!value || unit === "lifetime") return null;

  const date = new Date(baseDate);

  if (unit === "days") {
    date.setDate(date.getDate() + Number(value));
  } else if (unit === "months") {
    date.setMonth(date.getMonth() + Number(value));
  } else if (unit === "years") {
    date.setFullYear(date.getFullYear() + Number(value));
  }

  return date;
};

const isEnrollmentExpired = (enrollment) => {
  if (!enrollment?.expiresAt) return false;
  return new Date(enrollment.expiresAt).getTime() < Date.now();
};

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = getUserId(req);

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "name email avatar",
        },
      })
      .sort({ createdAt: -1 });

    const validEnrollments = [];

    for (const enrollment of enrollments) {
      if (!enrollment.course) continue;

      const expired = isEnrollmentExpired(enrollment);

      if (expired && !enrollment.isExpired) {
        enrollment.isExpired = true;
        await enrollment.save();
      }

      validEnrollments.push({
        ...enrollment.toObject(),
        isExpired: expired,
      });
    }

    const completed = validEnrollments.filter((e) => e.progress === 100);
    const certificates = validEnrollments.filter((e) => e.certificateIssued);

    res.json({
      success: true,
      stats: {
        enrolledCourses: validEnrollments.length,
        completed: completed.length,
        certificates: certificates.length,
      },
      enrollments: validEnrollments,
    });
  } catch (err) {
    console.error("GET STUDENT DASHBOARD ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const enrollInFreeCourse = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course id is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (!course.isFree) {
      return res.status(400).json({
        success: false,
        message: "This is not a free course",
      });
    }

    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existing && !existing.isExpired) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    const startsAt = new Date();
    const expiresAt = calculateExpiryDate(
      course.accessDurationValue,
      course.accessDurationUnit,
      startsAt
    );

    await Enrollment.create({
      student: studentId,
      course: courseId,
      status: "active",
      totalLessons: 10,
      completedLessons: 0,
      progress: 0,
      startsAt,
      expiresAt,
      isExpired: false,
    });

    const alreadyInStudents = course.students.some(
      (id) => id.toString() === String(studentId)
    );

    if (!alreadyInStudents) {
      course.students.push(studentId);
      await course.save();
    }

    res.json({
      success: true,
      message: "Successfully enrolled in free course",
    });
  } catch (err) {
    console.error("FREE ENROLL ERROR:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};

export const getMyCourseAccess = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status: { $in: ["active", "completed"] },
    });

    const expired = isEnrollmentExpired(enrollment);

    if (enrollment && expired && !enrollment.isExpired) {
      enrollment.isExpired = true;
      await enrollment.save();
    }

    res.json({
      success: true,
      hasAccess: !!enrollment && !expired,
      enrollment: enrollment
        ? {
            ...enrollment.toObject(),
            isExpired: expired,
          }
        : null,
    });
  } catch (err) {
    console.error("GET COURSE ACCESS ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const completeCourseAndIssueCertificate = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    }).populate("course");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (isEnrollmentExpired(enrollment)) {
      return res.status(400).json({
        success: false,
        message: "Course access has expired",
      });
    }

    if (enrollment.certificateIssued && enrollment.certificate) {
      const existingCertificate = await Certificate.findById(enrollment.certificate);

      return res.json({
        success: true,
        message: "Certificate already issued",
        certificate: existingCertificate,
      });
    }

    enrollment.progress = 100;
    enrollment.status = "completed";
    enrollment.completedAt = new Date();

    const certificateId = `CRT-${Date.now()}-${String(courseId).slice(-6)}`;

    const certificate = await Certificate.create({
      certificateId,
      student: studentId,
      course: enrollment.course._id,
      enrollment: enrollment._id,
      studentName: req.user?.name || "Student",
      courseTitle: enrollment.course?.title || "Course",
      issuedBy: "Coursify",
      issuedAt: new Date(),
    });

    enrollment.certificateIssued = true;
    enrollment.certificate = certificate._id;

    await enrollment.save();

    return res.json({
      success: true,
      message: "Course completed and certificate issued",
      certificate,
    });
  } catch (err) {
    console.error("COMPLETE COURSE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const studentId = getUserId(req);

    const certificates = await Certificate.find({ student: studentId })
      .populate("course", "title")
      .populate("enrollment")
      .sort({ issuedAt: -1 });

    return res.json({
      success: true,
      certificates,
    });
  } catch (err) {
    console.error("GET CERTIFICATES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};