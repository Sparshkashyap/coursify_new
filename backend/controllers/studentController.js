import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Certificate from "../models/Certificate.js";

const getUserId = (req) => req.user?._id || req.user?.id;

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

    const validEnrollments = enrollments.filter((e) => e.course);

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

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    await Enrollment.create({
      student: studentId,
      course: courseId,
      status: "active",
      totalLessons: 10,
      completedLessons: 0,
      progress: 0,
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

    res.json({
      success: true,
      hasAccess: !!enrollment,
      enrollment: enrollment || null,
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