import API from "@/api/axios";

export const generateCourseQuiz = async (
  courseId: string,
  payload?: {
    topic?: string;
    difficulty?: "easy" | "medium" | "hard";
  }
) => {
  const res = await API.post(`/course-assistant/quiz/${courseId}`, payload || {});
  return res.data;
};

export const askCourseAssistant = async (
  courseId: string,
  message: string
) => {
  const res = await API.post(`/course-assistant/chat/${courseId}`, { message });
  return res.data;
};

export const getCourseSummary = async (courseId: string) => {
  const res = await API.get(`/course-assistant/summary/${courseId}`);
  return res.data;
};

export const getNextLessonGuidance = async (courseId: string) => {
  const res = await API.get(`/course-assistant/next-lesson/${courseId}`);
  return res.data;
};