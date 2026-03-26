import API from "@/api/axios";

export const generateCourseDescription = async (payload: {
  topic: string;
  audience?: string;
  outcomes?: string;
  tone?: string;
}) => {
  const res = await API.post("/ai/generate-course-description", payload);
  return res.data;
};