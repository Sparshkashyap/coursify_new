import API from "@/api/axios";

export const getMyAffiliate = async () => {
  const res = await API.get("/affiliates/me");
  return res.data;
};

export const trackAffiliateClick = async (code: string) => {
  const res = await API.post("/affiliates/track-click", { code });
  return res.data;
};