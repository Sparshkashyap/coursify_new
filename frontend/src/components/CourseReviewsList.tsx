import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  reviews: any[];
}

const CourseReviewsList: React.FC<Props> = ({ reviews }) => {
  if (!reviews.length) {
    return (
      <div className="rounded-3xl border border-dashed p-8 text-center text-muted-foreground">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <motion.div
          key={review._id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="rounded-3xl border bg-card p-5 shadow-sm"
        >
          <div className="mb-3 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.student?.avatar || ""} />
              <AvatarFallback>
                {review.student?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <p className="font-medium">{review.student?.name || "Student"}</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`h-4 w-4 ${
                      value <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>

            <span className="text-xs text-muted-foreground">
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {review.comment}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseReviewsList;