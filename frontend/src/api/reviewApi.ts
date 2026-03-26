import API from "@/api/axios";

export const getCourseReviews = async (courseId: string) => {
  const res = await API.get(`/reviews/${courseId}`);
  return res.data;
};

export const saveCourseReview = async (
  courseId: string,
  payload: { rating: number; comment: string }
) => {
  const res = await API.post(`/reviews/${courseId}`, payload);
  return res.data;
};