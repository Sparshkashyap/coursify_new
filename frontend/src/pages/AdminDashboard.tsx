import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  UserCog,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatsCard from "@/components/dashboard/StatsCard";
import EarningsChart from "@/components/dashboard/EarningsChart";
import { getAdminOverview } from "@/api/adminApi";
import { toast, ToastContainer } from "react-toastify";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalPayments: 0,
    totalRevenue: 0,
    activeStudents: 0,
  });

  const [chartData, setChartData] = useState<{ month: string; earnings: number }[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        const data = await getAdminOverview();
        setOverview(
          data.overview || {
            totalUsers: 0,
            totalAdmins: 0,
            totalStudents: 0,
            totalInstructors: 0,
            totalCourses: 0,
            totalPayments: 0,
            totalRevenue: 0,
            activeStudents: 0,
          }
        );
        setChartData(data.chartData || []);
        setRecentUsers(data.recentUsers || []);
        setRecentCourses(data.recentCourses || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <div className="space-y-8">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Oversee users, roles, courses, revenue, and platform-level operations.
        </p>
      </motion.div>

      {/* MAIN STATS */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatsCard
          title="Total Users"
          value={overview.totalUsers.toLocaleString()}
          icon={Users}
        />
        <StatsCard
          title="Total Courses"
          value={overview.totalCourses.toLocaleString()}
          icon={BookOpen}
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${overview.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Active Students"
          value={overview.activeStudents.toLocaleString()}
          icon={TrendingUp}
        />
      </motion.div>

      {/* ROLE STATS */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.08 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <StatsCard
          title="Admins"
          value={overview.totalAdmins.toLocaleString()}
          icon={ShieldCheck}
        />
        <StatsCard
          title="Students"
          value={overview.totalStudents.toLocaleString()}
          icon={GraduationCap}
        />
        <StatsCard
          title="Instructors"
          value={overview.totalInstructors.toLocaleString()}
          icon={UserCog}
        />
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.12 }}>
        {loading ? (
          <div className="h-[320px] rounded-3xl bg-muted animate-pulse" />
        ) : (
          <EarningsChart data={chartData} />
        )}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.16 }}>
          <Card className="rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Users</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/users">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isBlocked ? "destructive" : "outline"}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <Card className="rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Courses</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/courses">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCourses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.instructor?.name || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.24 }}>
        <Card className="rounded-3xl border-dashed">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-primary/10 p-3">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Platform Controls</h3>
              <p className="text-sm text-muted-foreground">
                Manage users, courses, payments and global settings from dedicated admin pages.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link to="/admin/settings">
                <ShieldCheck className="h-4 w-4" />
                Open Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default AdminDashboard;