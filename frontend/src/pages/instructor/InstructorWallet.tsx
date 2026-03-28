import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getInstructorWallet } from "@/api/payoutApi";
import StatsCard from "@/components/dashboard/StatsCard";
import { Wallet, ArrowUpRight, Hourglass, Landmark } from "lucide-react";

const InstructorWallet: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [recentPayouts, setRecentPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const data = await getInstructorWallet();
      setWallet(data?.wallet || null);
      setRecentPayouts(data?.recentPayouts || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Instructor Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your earnings, available balance, and payout activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Earnings"
          value={loading ? "Loading..." : `₹${Number(wallet?.totalEarnings || 0).toLocaleString()}`}
          icon={Wallet}
        />
        <StatsCard
          title="Available Balance"
          value={loading ? "Loading..." : `₹${Number(wallet?.availableBalance || 0).toLocaleString()}`}
          icon={Landmark}
        />
        <StatsCard
          title="Pending Payout"
          value={loading ? "Loading..." : `₹${Number(wallet?.pendingPayout || 0).toLocaleString()}`}
          icon={Hourglass}
        />
        <StatsCard
          title="Withdrawn"
          value={loading ? "Loading..." : `₹${Number(wallet?.totalWithdrawn || 0).toLocaleString()}`}
          icon={ArrowUpRight}
        />
      </div>

      <div className="rounded-3xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Recent Payout Activity</h2>

        <div className="mt-4 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
            ))
          ) : recentPayouts.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              No payout activity yet.
            </div>
          ) : (
            recentPayouts.map((item) => (
              <div key={item._id} className="rounded-2xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">₹{item.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-xs capitalize">
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorWallet;