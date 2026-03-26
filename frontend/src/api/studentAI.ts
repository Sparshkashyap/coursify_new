import API from "@/api/axios";

export const getStudentAIRecommendations = async (query: string) => {
  const res = await API.post("/student-ai/recommendation", { query });
  return res.data;
};