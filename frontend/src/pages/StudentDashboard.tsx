import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Heart,
  Sparkles,
  ArrowRight,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import CertificateBadge from "@/components/dashboard/CertificateBadge";
import ProgressTracker from "@/components/ProgressTracker";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { getStudentDashboard } from "@/api/studentApi";
import { getWishlist } from "@/api/wishlistApi";
import CourseCard from "@/components/CourseCard";
import { toast } from "react-toastify";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const StudentDashboard: React.FC = () => {
  const { wishlist } = useWishlist();

  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completed: 0,
    certificates: 0,
  });
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [wishlistedCourses, setWishlistedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [dashboardData, wishlistData] = await Promise.all([
          getStudentDashboard(),
          getWishlist(),
        ]);

        setStats(
          dashboardData.stats || {
            enrolledCourses: 0,
            completed: 0,
            certificates: 0,
          }
        );
        setEnrollments(dashboardData.enrollments || []);
        setWishlistedCourses(wishlistData.wishlist || []);
      } catch (err) {
        console.error("STUDENT DASHBOARD ERROR:", err);
        toast.error("Failed to load student dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [wishlist.length]);

  const completed = useMemo(
    () => enrollments.filter((ec) => ec.progress === 100),
    [enrollments]
  );

  const inProgress = useMemo(
    () => enrollments.filter((ec) => ec.progress > 0 && ec.progress < 100),
    [enrollments]
  );

  const latestCourse = enrollments[0];

  return (
    <div className="space-y-8">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your learning, continue enrolled courses, and manage your wishlist.
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatsCard title="Enrolled Courses" value={stats.enrolledCourses} icon={BookOpen} />
        <StatsCard title="Completed" value={stats.completed} icon={CheckCircle2} />
        <StatsCard title="Certificates" value={stats.certificates} icon={Award} />
        <StatsCard title="Wishlist" value={wishlistedCourses.length} icon={Heart} />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.08 }}
        >
          <Card className="rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Continue Learning</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/student/courses">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-5">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : enrollments.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
                  You have not enrolled in any courses yet.
                </div>
              ) : (
                enrollments.slice(0, 4).map((ec, index) => (
                  <motion.div
                    key={ec._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 rounded-2xl border p-4 transition hover:shadow-md"
                  >
                    <img
                      src={ec.course?.image || "https://placehold.co/320x200?text=Course"}
                      alt={ec.course?.title}
                      className="hidden h-16 w-24 rounded-md object-cover sm:block"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold">{ec.course?.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {ec.progress === 100 ? "Completed" : "In Progress"}
                        </span>
                      </div>

                      <ProgressTracker
                        progress={ec.progress}
                        completedLessons={ec.completedLessons}
                        totalLessons={ec.totalLessons}
                      />
                    </div>

                    <Button asChild size="sm">
                      <Link to={`/courses/${ec.course?._id}`}>Open</Link>
                    </Button>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.12 }}
          className="space-y-6"
        >
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Learning Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-4">
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  In Progress
                </span>
                <span className="font-semibold">{inProgress.length}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-4">
                <span className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Certificates
                </span>
                <span className="font-semibold">{stats.certificates}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-4">
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Saved Courses
                </span>
                <span className="font-semibold">{wishlistedCourses.length}</span>
              </div>
            </CardContent>
          </Card>

          {latestCourse && (
            <Card className="rounded-3xl border-dashed">
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Recently Active
                </p>
                <h3 className="mt-2 font-semibold">{latestCourse.course?.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick up where you left off and continue building momentum.
                </p>
                <Button asChild className="mt-4 w-full">
                  <Link to={`/courses/${latestCourse.course?._id}`}>Resume Course</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {completed.filter((c) => c.certificateIssued).length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.16 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Certificates & Badges</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/student/certificates">View All</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {completed
              .filter((c) => c.certificateIssued)
              .slice(0, 4)
              .map((ec) => (
                <CertificateBadge key={ec._id} courseTitle={ec.course?.title} />
              ))}
          </div>
        </motion.div>
      )}

      {wishlistedCourses.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Wishlist</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/student/wishlist">View All</Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistedCourses.slice(0, 3).map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.24 }}
      >
        <Card className="rounded-3xl border-dashed">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-xl bg-primary/10 p-3">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">AI Course Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Discover better next-step courses based on your current enrollments and wishlist.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/student/recommendations">Explore</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;