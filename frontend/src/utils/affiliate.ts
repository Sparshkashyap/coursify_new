const AFFILIATE_KEY = "affiliate_ref";

export const saveAffiliateCode = (code: string) => {
  if (!code) return;
  localStorage.setItem(AFFILIATE_KEY, code);
};

export const getAffiliateCode = () => {
  return localStorage.getItem(AFFILIATE_KEY) || "";
};

export const clearAffiliateCode = () => {
  localStorage.removeItem(AFFILIATE_KEY);
};