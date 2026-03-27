import React from "react";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

const CookieConsentBanner: React.FC = () => {
  const {
    hasMadeChoice,
    acceptAll,
    rejectNonEssential,
    setOpenManageModal,
  } = useCookieConsent();

  if (hasMadeChoice) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[99] mx-auto max-w-5xl rounded-3xl border bg-background/95 p-5 shadow-2xl backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <h3 className="text-lg font-bold">We use cookies</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            We use essential cookies to make the site work. With your permission,
            we may also use analytics, marketing, and preference cookies.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setOpenManageModal(true)}>
            Manage Cookies
          </Button>
          <Button variant="outline" onClick={rejectNonEssential}>
            Reject All
          </Button>
          <Button onClick={acceptAll}>Accept All</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;