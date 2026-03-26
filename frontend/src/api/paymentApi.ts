import API from "@/api/axios";

export const createCourseOrder = async (
  courseId: string,
  affiliateCode = ""
) => {
  const res = await API.post("/payments/create-order", {
    courseId,
    affiliateCode,
  });
  return res.data;
};

export const verifyCoursePayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await API.post("/payments/verify", payload);
  return res.data;
};