import React, { useEffect, useState } from "react";
import { Copy, Link2, Users, Wallet } from "lucide-react";
import { getMyAffiliate } from "@/api/affiliateApi";
import { toast, ToastContainer } from "react-toastify";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InstructorAffiliates: React.FC = () => {
  const [affiliate, setAffiliate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAffiliate = async () => {
      try {
        setLoading(true);
        const data = await getMyAffiliate();
        setAffiliate(data?.affiliate || null);
      } catch (err: any) {
        console.error("AFFILIATE FRONTEND ERROR:", err?.response?.data || err);
        toast.error(err?.response?.data?.message || "Failed to load affiliate data");
      } finally {
        setLoading(false);
      }
    };

    loadAffiliate();
  }, []);

  const affiliateLink = affiliate
    ? `${window.location.origin}/courses?ref=${affiliate.code}`
    : "";

  const handleCopy = async () => {
    try {
      if (!affiliateLink) return;
      await navigator.clipboard.writeText(affiliateLink);
      toast.success("Affiliate link copied");
    } catch (err) {
      console.error("COPY AFFILIATE LINK ERROR:", err);
      toast.error("Failed to copy affiliate link");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Affiliates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track referrals, conversions, and commissions.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-28 rounded-3xl bg-muted animate-pulse" />
          <div className="h-28 rounded-3xl bg-muted animate-pulse" />
          <div className="h-28 rounded-3xl bg-muted animate-pulse" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Clicks"
              value={affiliate?.totalClicks || 0}
              icon={Users}
            />
            <StatsCard
              title="Conversions"
              value={affiliate?.totalConversions || 0}
              icon={Link2}
            />
            <StatsCard
              title="Commission"
              value={`₹${affiliate?.totalCommission || 0}`}
              icon={Wallet}
            />
          </div>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Your Affiliate Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border bg-muted/30 p-4 break-all text-sm">
                {affiliateLink || "Affiliate link not available"}
              </div>

              <Button
                variant="outline"
                onClick={handleCopy}
                className="gap-2"
                disabled={!affiliateLink}
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default InstructorAffiliates;