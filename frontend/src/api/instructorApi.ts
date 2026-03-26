import API from "@/api/axios";

export const getInstructorOverview = async () => {
  const res = await API.get("/instructor/overview");
  return res.data;
};