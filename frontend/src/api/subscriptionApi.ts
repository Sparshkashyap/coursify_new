import API from "@/api/axios";

export const getPlans = async () => {
  const res = await API.get("/subscriptions/plans");
  return res.data;
};

export const getMySubscription = async () => {
  const res = await API.get("/subscriptions/my");
  return res.data;
};

export const createSubscriptionOrder = async (payload: {
  plan: "free" | "pro" | "premium";
  billingCycle: "monthly" | "yearly";
}) => {
  const res = await API.post("/subscriptions/create-order", payload);
  return res.data;
};

export const verifySubscriptionPayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await API.post("/subscriptions/verify", payload);
  return res.data;
};