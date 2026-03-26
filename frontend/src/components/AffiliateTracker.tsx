import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { saveAffiliateCode } from "@/utils/affiliate";
import { trackAffiliateClick } from "@/api/affiliateApi";

const AffiliateTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");

    if (!ref) return;

    saveAffiliateCode(ref);

    const alreadyTracked = sessionStorage.getItem(`affiliate_tracked_${ref}`);

    if (!alreadyTracked) {
      trackAffiliateClick(ref)
        .then(() => {
          sessionStorage.setItem(`affiliate_tracked_${ref}`, "1");
        })
        .catch((err) => {
          console.error("Affiliate click tracking failed", err);
        });
    }
  }, [location.search]);

  return null;
};

export default AffiliateTracker;