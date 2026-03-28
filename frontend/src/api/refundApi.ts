import API from "@/api/axios";

export const requestRefund = async (paymentId: string) => {
  const res = await API.post("/refunds/request", { paymentId });
  return res.data;
};

export const getMyRefundRequests = async () => {
  const res = await API.get("/refunds/my");
  return res.data;
};

export const getAllRefundRequests = async () => {
  const res = await API.get("/refunds/admin");
  return res.data;
};

export const processRefund = async (id: string) => {
  const res = await API.put(`/refunds/${id}/process`);
  return res.data;
};