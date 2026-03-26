import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveCourseReview } from "@/api/reviewApi";

interface Props {
  courseId: string;
  onSaved: () => void;
}

const CourseReviewForm: React.FC<Props> = ({ courseId, onSaved }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      setSaving(true);
      await saveCourseReview(courseId, { rating, comment: comment.trim() });
      toast.success("Review saved");
      setComment("");
      setRating(5);
      onSaved();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border bg-card p-5 shadow-sm"
    >
      <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>

      <div className="mb-4 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" onClick={() => setRating(value)}>
            <Star
              className={`h-6 w-6 ${
                value <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        rows={4}
        placeholder="Share your experience with this course"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button className="mt-4" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Submit Review"}
      </Button>
    </motion.div>
  );
};

export default CourseReviewForm;