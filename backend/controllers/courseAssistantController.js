import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import {
  generateQuizFromCourseContent,
  askCourseDoubt,
  generateCourseSummary,
  generateNextLessonGuidance,
} from "../services/aiService.js";

const getUserId = (req) => req.user?._id || req.user?.id;

const getAccessibleCourse = async (req) => {
  const studentId = getUserId(req);
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    return { error: { status: 404, message: "Course not found" } };
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
    status: { $in: ["active", "completed"] },
  });

  if (!enrollment) {
    return { error: { status: 403, message: "You do not have access to this course" } };
  }

  return { course, enrollment };
};

export const generateCourseQuiz = async (req, res) => {
  try {
    const { topic = "", difficulty = "medium" } = req.body;

    const result = await getAccessibleCourse(req);
    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    const quiz = await generateQuizFromCourseContent({
      course: result.course,
      topic,
      difficulty,
    });

    return res.json({
      success: true,
      quiz,
    });
  } catch (err) {
    console.error("GENERATE COURSE QUIZ ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to generate quiz",
    });
  }
};

export const askAssistantInCourse = async (req, res) => {
  try {
    const { message = "" } = req.body;

    if (!message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const result = await getAccessibleCourse(req);
    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    const answer = await askCourseDoubt({
      course: result.course,
      message,
    });

    return res.json({
      success: true,
      response: answer,
    });
  } catch (err) {
    console.error("ASK ASSISTANT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to get assistant response",
    });
  }
};

export const getCourseSummary = async (req, res) => {
  try {
    const result = await getAccessibleCourse(req);
    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    const summary = await generateCourseSummary({
      course: result.course,
    });

    return res.json({
      success: true,
      summary,
    });
  } catch (err) {
    console.error("GET COURSE SUMMARY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to generate summary",
    });
  }
};

export const getCourseNextLessonGuidance = async (req, res) => {
  try {
    const result = await getAccessibleCourse(req);
    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    const guidance = await generateNextLessonGuidance({
      course: result.course,
    });

    return res.json({
      success: true,
      guidance,
    });
  } catch (err) {
    console.error("NEXT LESSON GUIDANCE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to generate next lesson guidance",
    });
  }
};