import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getCategories } from "@/api/categoryApi";

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data?.categories || ["All"]);
      } catch (err) {
        console.error("CATEGORY LOAD ERROR:", err);
        setCategories(["All"]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className="relative overflow-hidden py-14 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.08),transparent_28%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.08),transparent_25%)]" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            Browse Categories
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold">
            Explore by Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find courses based on your interests and goals.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-11 w-28 animate-pulse rounded-full bg-muted"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, index) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onSelect(cat)}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                  selected === cat
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryFilter;