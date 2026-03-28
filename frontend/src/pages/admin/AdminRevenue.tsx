import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAdminEarningsOverview } from "@/api/earningApi";
import StatsCard from "@/components/dashboard/StatsCard";
import EarningsChart from "@/components/dashboard/EarningsChart";
import { DollarSign, CreditCard, Users, BookOpen } from "lucide-react";

const AdminRevenue: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRevenue = async () => {
    try {
      setLoading(true);
      const data = await getAdminEarningsOverview();
      setOverview(data?.overview || null);
      setChartData(data?.chartData || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Revenue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track platform commission, payment count, and revenue growth.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Platform Revenue"
          value={loading ? "Loading..." : `₹${Number(overview?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Paid Transactions"
          value={loading ? "Loading..." : Number(overview?.totalPayments || 0).toLocaleString()}
          icon={CreditCard}
        />
        <StatsCard
          title="Active Students"
          value={loading ? "Loading..." : Number(overview?.activeStudents || 0).toLocaleString()}
          icon={Users}
        />
        <StatsCard
          title="Total Courses"
          value={loading ? "Loading..." : Number(overview?.totalCourses || 0).toLocaleString()}
          icon={BookOpen}
        />
      </div>

      {!loading && chartData.length > 0 && <EarningsChart data={chartData} />}
    </div>
  );
};

export default AdminRevenue;