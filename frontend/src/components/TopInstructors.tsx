import React from "react";
import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockInstructors } from "@/data/mockData";
import defaultAvatar from "@/assets/avtar.jpg";

const duplicatedInstructors = [...mockInstructors, ...mockInstructors];

const TopInstructors: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16 bg-muted/50">
      <div className="container mb-10">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold">Top Instructors</h2>
          <p className="mt-2 text-muted-foreground">
            Learn from the best in the industry
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
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 28,
            ease: "linear",
            repeat: Infinity,
          }}
          whileHover={{}}
        >
          {duplicatedInstructors.map((inst, index) => (
            <motion.div
              key={`${inst.id}-${index}`}
              className="shrink-0"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="w-[250px] border-border/70 bg-card/90 text-center shadow-sm backdrop-blur transition-all duration-300 hover:shadow-xl sm:w-[270px]">
                <CardContent className="space-y-4 pt-6">
                  <Avatar className="mx-auto h-20 w-20 ring-2 ring-primary/10">
                    <AvatarImage
                      src={inst.avatar || defaultAvatar}
                      alt={inst.name}
                    />
                    <AvatarFallback>{inst.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-display text-base font-semibold">
                      {inst.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {inst.specialty}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 rounded-full bg-background px-2.5 py-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {inst.rating}
                    </span>

                    <span className="flex items-center gap-1 rounded-full bg-background px-2.5 py-1">
                      <Users className="h-3.5 w-3.5" />
                      {inst.students.toLocaleString()}
                    </span>
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

export default TopInstructors;