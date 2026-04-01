import Course from "../models/Course.js";
import Review from "../models/Review.js";
import Enrollment from "../models/Enrollment.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const normalizeCategory = (value) => {
  const cleaned = String(value || "General").trim();
  return cleaned || "General";
};

const normalizeAccessDuration = (value, unit) => {
  const normalizedUnit = ["days", "months", "years", "lifetime"].includes(unit)
    ? unit
    : "lifetime";

  const normalizedValue =
    normalizedUnit === "lifetime" ? 0 : Math.max(Number(value) || 0, 1);

  return {
    accessDurationValue: normalizedValue,
    accessDurationUnit: normalizedUnit,
  };
};

const isEnrollmentExpired = (enrollment) => {
  if (!enrollment?.expiresAt) return false;
  return new Date(enrollment.expiresAt).getTime() < Date.now();
};

export const createCourse = async (req, res) => {
  try {
    const userId = getUserId(req);

    const duration = normalizeAccessDuration(
      req.body.accessDurationValue,
      req.body.accessDurationUnit
    );

    const course = await Course.create({
      ...req.body,
      ...duration,
      category: normalizeCategory(req.body.category),
      instructor: userId,
    });

    res.json({ success: true, course });
  } catch (err) {
    console.error("CREATE COURSE ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      $or: [{ status: "published" }, { status: { $exists: false } }],
    })
      .populate("instructor", "name email avatar")
      .sort({ createdAt: -1 });

    const reviewStats = await Review.aggregate([
      {
        $group: {
          _id: "$course",
          reviewCount: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const reviewMap = {};
    reviewStats.forEach((item) => {
      reviewMap[item._id.toString()] = {
        reviewCount: item.reviewCount,
        rating: Number((item.avgRating || 0).toFixed(1)),
      };
    });

    const formattedCourses = courses.map((course) => {
      const stats = reviewMap[course._id.toString()] || {
        reviewCount: 0,
        rating: 0,
      };

      return {
        ...course.toObject(),
        category: normalizeCategory(course.category),
        reviewCount: stats.reviewCount,
        rating: stats.rating,
      };
    });

    res.json({
      success: true,
      courses: formattedCourses,
    });
  } catch (err) {
    console.error("GET ALL COURSES ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getCourseCategories = async (req, res) => {
  try {
    const categories = await Course.distinct("category", {
      $or: [{ status: "published" }, { status: { $exists: false } }],
      category: { $exists: true, $ne: "" },
    });

    const cleanedCategories = categories
      .filter(Boolean)
      .map((cat) => String(cat).trim())
      .filter((cat) => cat.length > 0)
      .sort((a, b) => a.localeCompare(b));

    return res.json({
      success: true,
      categories: ["All", ...cleanedCategories],
    });
  } catch (err) {
    console.error("GET COURSE CATEGORIES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const userId = getUserId(req);

    const courses = await Course.find({ instructor: userId }).sort({
      createdAt: -1,
    });

    const formattedCourses = courses.map((course) => ({
      ...course.toObject(),
      category: normalizeCategory(course.category),
    }));

    res.json({ success: true, courses: formattedCourses });
  } catch (err) {
    console.error("GET MY COURSES ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email avatar"
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const reviews = await Review.find({ course: course._id })
      .populate("student", "name avatar")
      .sort({ createdAt: -1 });

    let hasAccess = false;
    let enrollment = null;

    if (req.user?._id && req.user?.role === "student") {
      const foundEnrollment = await Enrollment.findOne({
        student: req.user._id,
        course: course._id,
        status: { $in: ["active", "completed"] },
      });

      if (foundEnrollment) {
        const expired = isEnrollmentExpired(foundEnrollment);

        if (expired && !foundEnrollment.isExpired) {
          foundEnrollment.isExpired = true;
          await foundEnrollment.save();
        }

        hasAccess = !expired;
        enrollment = {
          ...foundEnrollment.toObject(),
          isExpired: expired,
        };
      }
    }

    if (req.user?.role === "instructor" || req.user?.role === "admin") {
      hasAccess = true;
    }

    res.json({
      success: true,
      course: {
        ...course.toObject(),
        category: normalizeCategory(course.category),
        reviewCount: reviews.length,
      },
      reviews,
      hasAccess,
      enrollment,
    });
  } catch (err) {
    console.error("GET SINGLE COURSE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Server Error",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const userId = getUserId(req);

    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructor.toString() !== String(userId)) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    const updatePayload = {
      ...req.body,
    };

    if (updatePayload.category !== undefined) {
      updatePayload.category = normalizeCategory(updatePayload.category);
    }

    if (
      updatePayload.accessDurationValue !== undefined ||
      updatePayload.accessDurationUnit !== undefined
    ) {
      const duration = normalizeAccessDuration(
        updatePayload.accessDurationValue,
        updatePayload.accessDurationUnit
      );

      updatePayload.accessDurationValue = duration.accessDurationValue;
      updatePayload.accessDurationUnit = duration.accessDurationUnit;
    }

    course = await Course.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
    });

    res.json({ success: true, course });
  } catch (err) {
    console.error("UPDATE COURSE ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const userId = getUserId(req);

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructor.toString() !== String(userId)) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    console.error("DELETE COURSE ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};