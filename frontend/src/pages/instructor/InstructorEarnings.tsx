import React, { useEffect, useState } from "react";
import { Landmark, TrendingUp, Wallet, Users } from "lucide-react";
import { getInstructorOverview } from "@/api/instructorApi";
import StatsCard from "@/components/dashboard/StatsCard";
import EarningsChart from "@/components/dashboard/EarningsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, ToastContainer } from "react-toastify";

const InstructorEarnings: React.FC = () => {
  const [overview, setOverview] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEarnings: 0,
  });

  const [chartData, setChartData] = useState<{ month: string; earnings: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        const data = await getInstructorOverview();
        setOverview(data.overview);
        setChartData(data.chartData || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Earnings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review course earnings and growth over time.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Earnings" value={`₹${overview.totalEarnings.toLocaleString()}`} icon={Wallet} />
        <StatsCard title="Total Students" value={overview.totalStudents} icon={Users} />
        <StatsCard title="Courses" value={overview.totalCourses} icon={TrendingUp} />
      </div>

      {loading ? (
        <div className="h-[320px] rounded-3xl bg-muted animate-pulse" />
      ) : (
        <EarningsChart data={chartData} />
      )}

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Payout Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Real earnings data is now coming from paid transactions linked to your courses.
        </CardContent>
      </Card>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default InstructorEarnings;