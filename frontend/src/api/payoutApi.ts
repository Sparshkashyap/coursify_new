import API from "@/api/axios";

export const getInstructorWallet = async () => {
  const res = await API.get("/payouts/wallet");
  return res.data;
};

export const createPayoutRequest = async (payload: {
  amount: number;
  note?: string;
}) => {
  const res = await API.post("/payouts/request", payload);
  return res.data;
};

export const getInstructorPayoutRequests = async () => {
  const res = await API.get("/payouts/my-requests");
  return res.data;
};

export const getAdminPayoutRequests = async () => {
  const res = await API.get("/payouts/admin/requests");
  return res.data;
};

export const approvePayoutRequest = async (id: string, adminNote = "") => {
  const res = await API.put(`/payouts/admin/${id}/approve`, { adminNote });
  return res.data;
};

export const rejectPayoutRequest = async (id: string, adminNote = "") => {
  const res = await API.put(`/payouts/admin/${id}/reject`, { adminNote });
  return res.data;
};