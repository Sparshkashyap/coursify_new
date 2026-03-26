import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import API from "@/api/axios";

const FeaturedCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {
        setLoading(true);

        const res = await API.get("/courses");
        const allCourses = Array.isArray(res.data?.courses) ? res.data.courses : [];

        const normalizedCourses = allCourses.map((course: any) => {
          const studentsCount = Array.isArray(course.students)
            ? course.students.length
            : 0;

          return {
            ...course,
            studentsCount,
            reviewCount: Number(course.reviewCount || 0),
            rating: Number(course.rating || 0),
          };
        });

        const featured = normalizedCourses
          .sort((a: any, b: any) => {
            const aScore = a.rating * 10 + a.studentsCount + a.reviewCount * 2;
            const bScore = b.rating * 10 + b.studentsCount + b.reviewCount * 2;
            return bScore - aScore;
          })
          .slice(0, 8);

        setCourses(featured);
      } catch (error) {
        console.error("FEATURED COURSES ERROR:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCourses();
  }, []);

  return (
    <section className="py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-3xl font-bold">Featured Courses</h2>
          <p className="mt-2 text-muted-foreground">
            Explore top instructor-created courses
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border bg-muted/40"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            No featured courses available right now.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;