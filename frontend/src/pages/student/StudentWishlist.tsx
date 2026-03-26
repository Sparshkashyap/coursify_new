import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { getWishlist } from "@/api/wishlistApi";
import CourseCard from "@/components/CourseCard";

const StudentWishlist: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        const data = await getWishlist();
        setCourses(data.wishlist || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Courses you saved for later.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          <Heart className="mx-auto mb-3 h-8 w-8" />
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
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

export default StudentWishlist;