import React from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockReviews } from "@/data/mockData";
import defaultAvatar from "@/assets/avtar.jpg";

const StudentReviews: React.FC = () => {
  const topReviews = mockReviews.filter((r) => r.rating >= 4).slice(0, 3);

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold">What Our Students Say</h2>
          <p className="mt-2 text-muted-foreground">Real feedback from real learners</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {topReviews.map((review) => (
            <Card key={review.id} className="transition-all duration-300 hover:shadow-md">
              <CardContent className="pt-6 space-y-4">
                <Quote className="h-8 w-8 text-primary/30" />
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? "fill-warning text-warning" : "text-muted"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 border-t pt-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.avatar || defaultAvatar} />
                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{review.userName}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentReviews;
