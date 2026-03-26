import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Users, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";

interface InstructorType {
  _id?: string;
  name?: string;
  email?: string;
}

interface Course {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  image: string;
  price: number;
  isFree: boolean;
  rating?: number;
  students?: number | any[];
  instructor?: string | InstructorType;
  category?: string;
  level?: string;
  reviewCount?: number;
  duration?: string;
  lessons?: number;
}

interface CourseCardProps {
  course: Course;
  onUpdate?: (id: string, data: any) => void;
  onDelete?: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onUpdate,
  onDelete,
}) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [toggling, setToggling] = useState(false);

  const courseId = course._id || course.id || "";

  const instructorName =
    typeof course.instructor === "string"
      ? course.instructor
      : course.instructor?.name || "Unknown Instructor";

  const studentCount = Array.isArray(course.students)
    ? course.students.length
    : course.students || 0;

  const wishlisted = courseId ? isWishlisted(courseId) : false;

  const handleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!courseId || toggling) return;

    try {
      setToggling(true);
      await toggleWishlist(courseId);
    } finally {
      setToggling(false);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={course.image || "https://placehold.co/600x400?text=No+Image"}
          alt={course.title}
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <button
          onClick={handleWishlist}
          disabled={toggling}
          className="absolute right-3 top-3 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background disabled:opacity-60"
        >
          <Heart
            className={`h-4 w-4 ${
              wishlisted
                ? "fill-destructive text-destructive"
                : "text-muted-foreground"
            }`}
          />
        </button>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge
            className={`${
              course.isFree
                ? "bg-accent text-accent-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {course.isFree ? "Free" : `₹${course.price}`}
          </Badge>

          {course.category && (
            <Badge variant="outline" className="bg-background/90 backdrop-blur">
              <Tag className="mr-1 h-3 w-3" />
              {course.category}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="space-y-3 p-4">
        <Link to={`/courses/${courseId}`}>
          <h3 className="line-clamp-2 font-display font-semibold leading-tight transition-colors hover:text-primary">
            {course.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground">by {instructorName}</p>

        {course.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {course.description}
          </p>
        )}

        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-warning">
            {course.rating || 0}
          </span>

          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.round(course.rating || 0)
                    ? "fill-warning text-warning"
                    : "text-muted"
                }`}
              />
            ))}
          </div>

          <span className="text-xs text-muted-foreground">
            ({course.reviewCount || 0})
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {studentCount.toLocaleString()} students
          </span>
          <span>{course.isFree ? "Direct enroll" : "Secure payment"}</span>
        </div>

        <div className="mt-2 flex gap-2">
          {onUpdate && courseId && (
            <Button
              size="sm"
              onClick={() =>
                onUpdate(courseId, {
                  ...course,
                  title: course.title + " (Updated)",
                })
              }
            >
              Edit
            </Button>
          )}

          {onDelete && courseId && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(courseId)}
            >
              Delete
            </Button>
          )}
        </div>

        <Button className="w-full" size="sm" asChild>
          <Link to={`/courses/${courseId}`}>View Course</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;