import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Sparkles,
  Check,
  Flame,
  Layers3,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import { getCategories } from "@/api/categoryApi";
import API from "@/api/axios";

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
}

interface CourseItem {
  _id: string;
  title: string;
  category?: string;
}

const normalizeCategory = (value?: string) =>
  String(value || "").trim().toLowerCase();

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();

        const rawCategories = Array.isArray(data?.categories)
          ? data.categories
          : [];

        const cleanCategories: string[] = rawCategories
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean);

        const uniqueCategories: string[] = Array.from(new Set(cleanCategories));

        setCategories(
          uniqueCategories.includes("All")
            ? uniqueCategories
            : ["All", ...uniqueCategories]
        );
      } catch (err) {
        console.error("CATEGORY LOAD ERROR:", err);
        setCategories(["All"]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);
        const res = await API.get("/courses");
        setCourses(Array.isArray(res.data?.courses) ? res.data.courses : []);
      } catch (err) {
        console.error("CATEGORY COURSES LOAD ERROR:", err);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: courses.length,
    };

    for (const course of courses) {
      const key = String(course.category || "").trim();
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }

    return counts;
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (!courses.length) return [];

    if (selected === "All") return courses;

    return courses.filter(
      (course) =>
        normalizeCategory(course.category) === normalizeCategory(selected)
    );
  }, [courses, selected]);

  const featuredCourses = useMemo(() => {
    return filteredCourses.slice(0, 6);
  }, [filteredCourses]);

  const totalCategories = useMemo(() => {
    return categories.filter((cat) => cat !== "All").length;
  }, [categories]);

  const currentCount =
    selected === "All" ? courses.length : categoryCounts[selected] || 0;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 -z-20 bg-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_24%),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.14),transparent_22%),radial-gradient(circle_at_bottom_center,hsl(var(--primary)/0.08),transparent_28%)]" />
      <div className="absolute left-1/2 top-16 -z-10 h-52 w-52 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-10 top-10 -z-10 h-36 w-36 rounded-full bg-accent/10 blur-3xl" />

      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mx-auto max-w-6xl"
        >
          <motion.div
            variants={itemVariants}
            className="mb-10 text-center sm:mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-4 py-2 text-sm shadow-lg shadow-primary/5 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground/90">
                Discover smarter
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
              Explore courses that
              <span className="block bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
                actually catch attention
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Browse categories with a sharper, more premium experience and
              preview what users will actually want to click.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid gap-4 sm:grid-cols-3"
          >
            <div className="rounded-3xl border border-border/60 bg-background/70 p-5 shadow-[0_12px_50px_-18px_hsl(var(--foreground)/0.16)] backdrop-blur-xl">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Layers3 className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{totalCategories}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                categories available
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-background/70 p-5 shadow-[0_12px_50px_-18px_hsl(var(--foreground)/0.16)] backdrop-blur-xl">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{courses.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                courses in catalog
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-background/70 p-5 shadow-[0_12px_50px_-18px_hsl(var(--foreground)/0.16)] backdrop-blur-xl">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Flame className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{currentCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                in {selected === "All" ? "all categories" : selected}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-8 rounded-[32px] border border-white/10 bg-background/60 p-3 shadow-[0_18px_80px_-22px_hsl(var(--foreground)/0.22)] backdrop-blur-2xl"
          >
            {loading ? (
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 min-w-[140px] animate-pulse rounded-2xl bg-muted"
                  />
                ))}
              </div>
            ) : (
              <div className="no-scrollbar flex gap-3 overflow-x-auto py-1">
                {categories.map((cat, index) => {
                  const isActive = selected === cat;
                  const count =
                    cat === "All" ? courses.length : categoryCounts[cat] || 0;

                  return (
                    <motion.button
                      key={cat}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.03,
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onSelect(cat)}
                      aria-pressed={isActive}
                      className={`group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                        isActive
                          ? "border-primary/40 bg-primary text-primary-foreground shadow-[0_12px_35px_-10px_hsl(var(--primary)/0.65)]"
                          : "border-border/60 bg-card/80 text-foreground/85 hover:-translate-y-1 hover:border-primary/25 hover:bg-card hover:shadow-lg"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryBg"
                          className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary)/0.82))]"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 28,
                          }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {isActive ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Layers3 className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold">{cat}</p>
                          <p
                            className={`text-xs ${
                              isActive
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            }`}
                          >
                            {count} course{count === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>

                      <div className="relative z-10 ml-auto">
                        <span
                          className={`inline-flex h-2.5 w-2.5 rounded-full ${
                            isActive ? "bg-white" : "bg-primary/40"
                          }`}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-8 overflow-hidden rounded-[36px] border border-border/60 bg-card/60 shadow-[0_20px_90px_-28px_hsl(var(--foreground)/0.22)] backdrop-blur-2xl"
          >
            <div className="relative border-b border-border/50 px-5 py-5 sm:px-8 sm:py-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80">
                    Selected Category
                  </p>

                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={selected}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{
                        duration: 0.22,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                      {selected === "All" ? "All Categories" : selected}
                    </motion.h3>
                  </AnimatePresence>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {coursesLoading
                      ? "Loading courses..."
                      : `${currentCount} course${
                          currentCount === 1 ? "" : "s"
                        } ready to explore`}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm text-primary">
                  <Sparkles className="h-4 w-4" />
                  Personalized discovery feel
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              {coursesLoading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-36 animate-pulse rounded-3xl bg-muted"
                    />
                  ))}
                </div>
              ) : featuredCourses.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-background/50 px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold">
                    No courses found
                  </h4>
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    This category is empty right now. Either your data is messy,
                    category names are inconsistent, or there are no mapped
                    courses for this filter.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {featuredCourses.map((course, index) => (
                    <Link key={course._id} to={`/courses/${course._id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.32,
                          delay: index * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="group relative h-full cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-background/80 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-[0_18px_50px_-18px_hsl(var(--primary)/0.30)]"
                      >
                        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-4 flex items-center justify-between">
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
                              <span className="h-2 w-2 rounded-full bg-primary" />
                              {course.category || "Uncategorized"}
                            </span>

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground/70 transition-colors group-hover:bg-primary group-hover:text-white">
                              <ArrowUpRight className="h-4 w-4" />
                            </div>
                          </div>

                          <h4 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">
                            {course.title}
                          </h4>

                          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                            Explore a focused learning path with better structure,
                            stronger discovery, and a cleaner premium feel.
                          </p>

                          <div className="mt-6 flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">
                              Explore course
                            </span>
                            <span className="text-xs text-muted-foreground">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryFilter;