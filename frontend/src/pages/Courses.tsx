import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, SlidersHorizontal, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import CourseCard from "@/components/CourseCard";
import CategoryFilter from "@/components/CategoryFilter";
import { toast, ToastContainer } from "react-toastify";
import API from "@/api/axios";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const normalizeCategory = (value: string) =>
  String(value || "").trim().toLowerCase();

const Courses: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const res = await API.get("/courses");
        const data = res.data;

        if (data.success) {
          const normalizedCourses = (data.courses || []).map((course: any) => ({
            ...course,
            title: String(course.title || "").trim(),
            description: String(course.description || "").trim(),
            category: String(course.category || "General").trim(),
            reviewCount: Number(course.reviewCount || 0),
            rating: Number(course.rating || 0),
            students: Array.isArray(course.students)
              ? course.students
              : course.students || 0,
          }));

          setCourses(normalizedCourses);
        } else {
          toast.error(data.message || "Failed to fetch courses");
        }
      } catch (err) {
        console.error("COURSES FETCH ERROR:", err);
        toast.error("Something went wrong while fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const title = String(course.title || "").toLowerCase();
      const description = String(course.description || "").toLowerCase();
      const categoryValue = normalizeCategory(course.category);

      const instructorName =
        typeof course.instructor === "string"
          ? course.instructor.toLowerCase()
          : String(course.instructor?.name || "").toLowerCase();

      const query = search.trim().toLowerCase();

      const matchSearch =
        !query ||
        title.includes(query) ||
        description.includes(query) ||
        categoryValue.includes(query) ||
        instructorName.includes(query);

      const matchCategory =
        category === "All" ||
        normalizeCategory(course.category) === normalizeCategory(category);

      const matchPrice =
        priceFilter === "All" ||
        (priceFilter === "Free" && course.isFree) ||
        (priceFilter === "Paid" && !course.isFree);

      const matchRating = Number(course.rating || 0) >= minRating;

      return matchSearch && matchCategory && matchPrice && matchRating;
    });
  }, [courses, search, category, priceFilter, minRating]);

  return (
    <div className="pb-10">
      <CategoryFilter selected={category} onSelect={setCategory} />

      <div className="container py-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Explore Courses</h1>
          <p className="mt-1 text-muted-foreground">
            Browse {courses.length}+ published courses from instructors
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.06 }}
          className="relative mb-6"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, description, category, or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10"
          />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            <div className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Refine Results</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">Price</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["All", "Free", "Paid"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setPriceFilter(item)}
                        className={`rounded-xl border px-3 py-2 text-sm transition ${
                          priceFilter === item
                            ? "border-primary bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Star className="h-4 w-4 text-primary" />
                    Minimum Rating
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none"
                  >
                    <option value={0}>All ratings</option>
                    <option value={3}>3+ stars</option>
                    <option value={4}>4+ stars</option>
                    <option value={4.5}>4.5+ stars</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.14 }}
          >
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed py-16 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No courses found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((course, index) => (
                  <motion.div
                    key={course._id || course.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.04 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <ToastContainer autoClose={2000} />
      </div>
    </div>
  );
};

export default Courses;