import API from "@/api/axios";

export const getCategories = async () => {
  const res = await API.get("/courses/categories/list");
  return res.data;
};