import Review from "../models/Review.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const recalculateCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: "$course",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const avgRating = stats[0]?.avgRating || 0;

  await Course.findByIdAndUpdate(courseId, {
    rating: Number(avgRating.toFixed(1)),
  });
};

export const getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate("student", "name avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
      reviewCount: reviews.length,
    });
  } catch (err) {
    console.error("GET COURSE REVIEWS ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const upsertCourseReview = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const { rating, comment } = req.body;
    const { courseId } = req.params;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status: { $in: ["active", "completed"] },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "Only enrolled students can review this course",
      });
    }

    const review = await Review.findOneAndUpdate(
      { student: studentId, course: courseId },
      {
        rating,
        comment: comment || "",
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).populate("student", "name avatar");

    await recalculateCourseRating(courseId);

    res.json({
      success: true,
      review,
      message: "Review saved successfully",
    });
  } catch (err) {
    console.error("UPSERT REVIEW ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};