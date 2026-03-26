import API from "@/api/axios";

export const getWishlist = async () => {
  const res = await API.get("/wishlist");
  return res.data;
};

export const toggleWishlistCourse = async (courseId: string) => {
  const res = await API.post("/wishlist/toggle", { courseId });
  return res.data;
};