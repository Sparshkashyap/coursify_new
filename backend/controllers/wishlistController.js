import Wishlist from "../models/Wishlist.js";
import Course from "../models/Course.js";

const getUserId = (req) => req.user?._id || req.user?.id;

export const getMyWishlist = async (req, res) => {
  try {
    const studentId = getUserId(req);

    let wishlist = await Wishlist.findOne({ student: studentId }).populate({
      path: "courses",
      populate: {
        path: "instructor",
        select: "name email",
      },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        student: studentId,
        courses: [],
      });
      wishlist = await Wishlist.findById(wishlist._id).populate({
        path: "courses",
        populate: {
          path: "instructor",
          select: "name email",
        },
      });
    }

    res.json({
      success: true,
      wishlist: wishlist.courses || [],
    });
  } catch (err) {
    console.error("GET WISHLIST ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const toggleWishlistCourse = async (req, res) => {
  try {
    const studentId = getUserId(req);
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let wishlist = await Wishlist.findOne({ student: studentId });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        student: studentId,
        courses: [],
      });
    }

    const exists = wishlist.courses.some(
      (id) => id.toString() === String(courseId)
    );

    if (exists) {
      wishlist.courses = wishlist.courses.filter(
        (id) => id.toString() !== String(courseId)
      );
    } else {
      wishlist.courses.push(courseId);
    }

    await wishlist.save();

    res.json({
      success: true,
      isWishlisted: !exists,
      message: exists ? "Removed from wishlist" : "Added to wishlist",
    });
  } catch (err) {
    console.error("TOGGLE WISHLIST ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};