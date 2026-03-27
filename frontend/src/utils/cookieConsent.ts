export type CookieConsent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  updatedAt: string | null;
};

export const COOKIE_CONSENT_KEY = "coursify_cookie_consent";

export const defaultConsent: CookieConsent = {
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
  updatedAt: null,
};

export const getStoredCookieConsent = (): CookieConsent | null => {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveCookieConsent = (consent: CookieConsent) => {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
};

export const clearCookieConsent = () => {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
};