import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  CookieConsent,
  defaultConsent,
  getStoredCookieConsent,
  saveCookieConsent,
} from "@/utils/cookieConsent";

type CookieConsentContextType = {
  consent: CookieConsent | null;
  hasMadeChoice: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (values: {
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  }) => void;
  openManageModal: boolean;
  setOpenManageModal: (value: boolean) => void;
};

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [openManageModal, setOpenManageModal] = useState(false);

  useEffect(() => {
    const stored = getStoredCookieConsent();
    setConsent(stored);
  }, []);

  const acceptAll = () => {
    const next: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
      updatedAt: new Date().toISOString(),
    };
    saveCookieConsent(next);
    setConsent(next);
    setOpenManageModal(false);
  };

  const rejectNonEssential = () => {
    const next: CookieConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
      updatedAt: new Date().toISOString(),
    };
    saveCookieConsent(next);
    setConsent(next);
    setOpenManageModal(false);
  };

  const savePreferences = (values: {
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  }) => {
    const next: CookieConsent = {
      essential: true,
      analytics: values.analytics,
      marketing: values.marketing,
      preferences: values.preferences,
      updatedAt: new Date().toISOString(),
    };
    saveCookieConsent(next);
    setConsent(next);
    setOpenManageModal(false);
  };

  const value = useMemo(
    () => ({
      consent,
      hasMadeChoice: !!consent,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openManageModal,
      setOpenManageModal,
    }),
    [consent, openManageModal]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
};