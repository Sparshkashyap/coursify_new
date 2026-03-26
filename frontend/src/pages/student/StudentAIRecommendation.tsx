import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Bot } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getStudentAIRecommendations } from "@/api/studentAI";
import CourseCard from "@/components/CourseCard";

const StudentAIRecommendation: React.FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please describe what kind of course you want");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      setRecommendations([]);

      const data = await getStudentAIRecommendations(query);

      if (data.success) {
        setRecommendations(data.recommendations || []);
        if (!data.recommendations?.length) {
          toast.info("No recommendations found");
        }
      } else {
        toast.error(data.message || "Failed to get recommendations");
      }
    } catch (err: any) {
      console.error("STUDENT AI FRONTEND ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">AI Course Recommendation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell AI your goals, budget, and skill level to find the best course.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border bg-card p-6 shadow-sm space-y-4"
      >
        <Textarea
          rows={5}
          placeholder="Example: I am a beginner, I want to learn full stack web development, my budget is 3000, and I want job-ready practical courses."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <Button onClick={handleSearch} disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Finding best courses...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Get Recommendations
            </>
          )}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div>
          <h2 className="text-xl font-semibold">Recommended Courses</h2>
          <p className="text-sm text-muted-foreground">
            AI-selected courses based on your needs
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              AI is analyzing available courses...
            </div>

            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseCard course={course} />
                {course.aiReason && (
                  <div className="mt-3 rounded-2xl border bg-card p-4 text-sm text-muted-foreground shadow-sm">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <Bot className="h-4 w-4" />
                      Why this fits
                    </div>
                    <p className="leading-6">{course.aiReason}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : hasSearched ? (
          <div className="rounded-3xl border border-dashed bg-card p-10 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-3 h-7 w-7" />
            No recommendations found for your query.
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed bg-card p-10 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-3 h-7 w-7" />
            Enter your goal above and AI will recommend the best courses.
          </div>
        )}
      </motion.div>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default StudentAIRecommendation;