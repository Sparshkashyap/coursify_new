import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { loadGoogleAnalytics, trackPageView } from "@/lib/analytics";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

const AnalyticsLoader = () => {
  const location = useLocation();
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (consent?.analytics) {
      loadGoogleAnalytics();
    }
  }, [consent]);

  useEffect(() => {
    if (consent?.analytics) {
      trackPageView(location.pathname);
    }
  }, [location.pathname, consent]);

  return null;
};

export default AnalyticsLoader;