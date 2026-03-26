import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { Review } from "@/data/mockData";
import defaultAvatar from "@/assets/avtar.jpg";
import { ToastContainer } from "react-toastify";

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a rating"); return; }
    toast.success("Review submitted!");
    setRating(0);
    setComment("");
  };

  return (
    <div className="space-y-6">
      {/* Add Review */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-display font-semibold">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      star <= (hoverRating || rating) ? "fill-warning text-warning" : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
            <Button type="submit" size="sm">Submit Review</Button>
          </form>
        </CardContent>
      </Card>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.avatar || defaultAvatar} />
                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-warning text-warning" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default ReviewSection;
