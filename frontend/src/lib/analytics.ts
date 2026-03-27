import { getStoredCookieConsent } from "@/utils/cookieConsent";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const loadGoogleAnalytics = () => {
  const consent = getStoredCookieConsent();

  if (!consent?.analytics) {
    return;
  }

  if (!GA_ID) {
    console.warn("GA Measurement ID missing");
    return;
  }

  if (window.gtag) {
    return;
  }

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    page_path: window.location.pathname,
  });
};

export const trackPageView = (url: string) => {
  const consent = getStoredCookieConsent();

  if (!consent?.analytics) return;
  if (!window.gtag) return;

  window.gtag("config", GA_ID, {
    page_path: url,
  });
};