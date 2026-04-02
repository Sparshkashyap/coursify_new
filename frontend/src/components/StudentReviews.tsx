import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockReviews } from "@/data/mockData";
import defaultAvatar from "@/assets/avtar.jpg";

const topReviews = mockReviews.filter((r) => r.rating >= 4);
const duplicatedReviews = [...topReviews, ...topReviews];

const StudentReviews: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="container mb-10">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold">
            What Our Students Say
          </h2>
          <p className="mt-2 text-muted-foreground">
            Real feedback from real learners
          </p>
        </div>
      </div>

      <div className="relative">
        {/* left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background via-background/80 to-transparent sm:w-24" />

        {/* right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background via-background/80 to-transparent sm:w-24" />

        <motion.div
          className="flex w-max gap-6 px-4 sm:px-6"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedReviews.map((review, index) => (
            <motion.div
              key={`${review.id}-${index}`}
              className="shrink-0"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="w-[280px] border-border/70 bg-card/95 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-xl sm:w-[320px]">
                <CardContent className="space-y-4 pt-6">
                  <Quote className="h-8 w-8 text-primary/30" />

                  <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3 border-t pt-4">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                      <AvatarImage src={review.avatar || defaultAvatar} />
                      <AvatarFallback>
                        {review.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-medium">{review.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.date}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StudentReviews;