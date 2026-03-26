import React from "react";
import { Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockInstructors } from "@/data/mockData";
import defaultAvatar from "@/assets/avtar.jpg";

const TopInstructors: React.FC = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold">Top Instructors</h2>
          <p className="mt-2 text-muted-foreground">Learn from the best in the industry</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {mockInstructors.map((inst) => (
            <Card key={inst.id} className="text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="pt-6 space-y-3">
                <Avatar className="mx-auto h-20 w-20">
                  <AvatarImage src={inst.avatar || defaultAvatar} alt={inst.name} />
                  <AvatarFallback>{inst.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-display font-semibold">{inst.name}</h3>
                  <p className="text-xs text-muted-foreground">{inst.specialty}</p>
                </div>
                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" /> {inst.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {inst.students.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopInstructors;
