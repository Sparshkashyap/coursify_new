import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import API from "@/api/axios";
import { getStudentDashboard } from "@/api/studentApi";
import CourseCard from "@/components/CourseCard";

const StudentRecommendations: React.FC = () => {
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const [courseRes, dashboardRes] = await Promise.all([
          API.get("/courses"),
          getStudentDashboard(),
        ]);

        setAllCourses(courseRes.data?.courses || []);
        setEnrollments(dashboardRes.enrollments || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const recommended = useMemo(() => {
    const enrolledIds = new Set(
      enrollments.map((item: any) => item.course?._id).filter(Boolean)
    );

    return allCourses
      .filter((course: any) => !enrolledIds.has(course._id))
      .sort((a: any, b: any) => {
        const aScore = (a.rating || 0) * 10 + (Array.isArray(a.students) ? a.students.length : 0);
        const bScore = (b.rating || 0) * 10 + (Array.isArray(b.students) ? b.students.length : 0);
        return bScore - aScore;
      })
      .slice(0, 6);
  }, [allCourses, enrollments]);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Recommendations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Suggested courses based on your learning activity.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : recommended.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          <Sparkles className="mx-auto mb-3 h-8 w-8" />
          No recommendations available right now.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentRecommendations;