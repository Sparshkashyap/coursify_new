import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressTracker from "@/components/ProgressTracker";
import { getStudentDashboard } from "@/api/studentApi";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Lifetime";
  return new Date(value).toLocaleDateString();
};

const StudentCourses: React.FC = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await getStudentDashboard();
        setEnrollments(data.enrollments || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Access all courses you have enrolled in.
        </p>
      </motion.div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
            ))
          ) : enrollments.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
              <BookOpen className="mx-auto mb-3 h-8 w-8" />
              No enrolled courses found.
            </div>
          ) : (
            enrollments.map((ec, index) => (
              <motion.div
                key={ec._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-4 rounded-2xl border p-4 transition hover:shadow-md"
              >
                <img
                  src={ec.course?.image || "https://placehold.co/320x200?text=Course"}
                  alt={ec.course?.title}
                  className="hidden h-20 w-28 rounded-lg object-cover sm:block"
                />

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{ec.course?.title}</h3>
                    <span
                      className={`text-xs ${
                        ec.isExpired
                          ? "text-destructive"
                          : ec.progress === 100
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {ec.isExpired
                        ? "Expired"
                        : ec.progress === 100
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>

                  <ProgressTracker
                    progress={ec.progress}
                    completedLessons={ec.completedLessons}
                    totalLessons={ec.totalLessons}
                  />

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Started: {formatDate(ec.startsAt)}
                    </span>
                    <span>Valid till: {formatDate(ec.expiresAt)}</span>
                  </div>
                </div>

                <Button asChild disabled={ec.isExpired}>
                  <Link to={`/courses/${ec.course?._id}`}>
                    {ec.isExpired ? "Expired" : "Open Course"}
                  </Link>
                </Button>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentCourses;