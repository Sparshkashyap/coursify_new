import API from "@/api/axios";

export const getInstructorEarningsOverview = async () => {
  const res = await API.get("/earnings/instructor/overview");
  return res.data;
};

export const getAdminEarningsOverview = async () => {
  const res = await API.get("/earnings/admin/overview");
  return res.data;
};