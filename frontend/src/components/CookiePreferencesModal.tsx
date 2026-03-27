import React, { useEffect, useState } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { Button } from "@/components/ui/button";

const CookiePreferencesModal: React.FC = () => {
  const {
    consent,
    openManageModal,
    setOpenManageModal,
    savePreferences,
    rejectNonEssential,
    acceptAll,
  } = useCookieConsent();

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [preferences, setPreferences] = useState(false);

  useEffect(() => {
    if (consent) {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
      setPreferences(consent.preferences);
    }
  }, [consent, openManageModal]);

  if (!openManageModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-3xl border bg-background p-6 shadow-xl">
        <h2 className="text-xl font-bold">Manage Cookie Preferences</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Control which non-essential cookies we can use. Essential cookies are always on.
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Essential Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Required for login, security, and core site functionality.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Always Active
              </span>
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Analytics Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Help us understand how users interact with the website.
                </p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
              />
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Marketing Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Used for ads, retargeting, and campaign measurement.
                </p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Preference Cookies</p>
                <p className="text-sm text-muted-foreground">
                  Remember UI and personalization settings.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences}
                onChange={(e) => setPreferences(e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setOpenManageModal(false)}
          >
            Close
          </Button>

          <Button variant="outline" onClick={rejectNonEssential}>
            Reject All
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              savePreferences({ analytics, marketing, preferences })
            }
          >
            Save Preferences
          </Button>

          <Button onClick={acceptAll}>Accept All</Button>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferencesModal;