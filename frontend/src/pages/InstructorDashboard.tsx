import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  DollarSign,
  Pencil,
  Trash2,
  Plus,
  Eye,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/dashboard/StatsCard";
import EarningsChart from "@/components/dashboard/EarningsChart";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import API from "@/api/axios";
import { getInstructorEarningsOverview } from "@/api/earningApi";

interface Course {
  _id: string;
  title: string;
  description?: string;
  image: string;
  video?: string;
  price: number;
  isFree: boolean;
  students?: any[];
  rating?: number;
  createdAt?: string;
}

interface EarningsPoint {
  month: string;
  earnings: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [earningsData, setEarningsData] = useState<EarningsPoint[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses/my");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("FETCH COURSES ERROR:", err);
      toast.error("Failed to load courses");
    }
  };

  const fetchEarnings = async () => {
    try {
      setEarningsLoading(true);

      const data = await getInstructorEarningsOverview();

      setTotalEarnings(Number(data?.totalEarnings || 0));
      setTotalSales(Number(data?.totalSales || 0));
      setTotalTransactions(Number(data?.totalTransactions || 0));
      setEarningsData(Array.isArray(data?.chartData) ? data.chartData : []);
    } catch (err: any) {
      console.error("FETCH EARNINGS ERROR:", err?.response?.data || err);
      setTotalEarnings(0);
      setTotalSales(0);
      setTotalTransactions(0);
      setEarningsData([]);
      toast.error(
        err?.response?.data?.message || "Failed to load earnings data"
      );
    } finally {
      setEarningsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCourses(), fetchEarnings()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [location.key]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this course?");
    if (!confirmed) return;

    try {
      await API.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success("Course deleted");
    } catch (err: any) {
      console.error("DELETE FRONTEND ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const totalStudents = courses.reduce(
    (sum, c) => sum + (c.students?.length || 0),
    0
  );

  return (
    <div className="space-y-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Instructor Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your courses, sales, and earnings from one place.
          </p>
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => navigate("/instructor/add-course")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard title="Total Students" value={totalStudents} icon={Users} />
        <StatsCard title="Courses" value={courses.length} icon={BookOpen} />
        <StatsCard
          title="Earnings"
          value={earningsLoading ? "Loading..." : `₹${totalEarnings.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Sales"
          value={earningsLoading ? "Loading..." : `₹${totalSales.toLocaleString()}`}
          icon={Wallet}
        />
      </motion.div>

      {!earningsLoading && earningsData.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <EarningsChart data={earningsData} />
        </motion.div>
      )}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.46, delay: 0.09 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card className="rounded-3xl border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {earningsLoading ? "..." : totalTransactions}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Platform Model</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              Revenue Share
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border bg-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              Active
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="rounded-3xl border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground">My Courses</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-3">
                <div className="h-24 rounded-2xl bg-muted animate-pulse" />
                <div className="h-24 rounded-2xl bg-muted animate-pulse" />
                <div className="h-24 rounded-2xl bg-muted animate-pulse" />
              </div>
            ) : courses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  No courses yet. Start by creating your first course.
                </p>
                <Button onClick={() => navigate("/instructor/add-course")}>
                  Create Course
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    whileHover={{ y: -2 }}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 transition hover:shadow-md md:flex-row md:items-center"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    <img
                      src={
                        course.image ||
                        "https://placehold.co/160x90?text=No+Image"
                      }
                      alt={course.title}
                      className="h-24 w-full rounded-xl object-cover md:h-16 md:w-24"
                    />

                    <div className="min-w-0 flex-1 cursor-pointer">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {course.title}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {course.description || "No description available"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {course.students?.length || 0} students
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="shrink-0 rounded-full px-3 py-1">
                        {course.isFree ? "Free" : `₹${course.price}`}
                      </Badge>

                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course._id}`);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </motion.div>

                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/instructor/edit-course/${course._id}`);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                      </motion.div>

                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(course._id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default InstructorDashboard;