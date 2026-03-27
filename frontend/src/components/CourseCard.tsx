import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Users, Tag, Clock3, BookOpen } from "lucide-react";
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
  const [optimisticWishlisted, setOptimisticWishlisted] = useState<
    boolean | null
  >(null);

  const courseId = course._id || course.id || "";

  const instructorName =
    typeof course.instructor === "string"
      ? course.instructor
      : course.instructor?.name || "Unknown Instructor";

  const studentCount = Array.isArray(course.students)
    ? course.students.length
    : course.students || 0;

  const serverWishlisted = courseId ? isWishlisted(courseId) : false;

  const wishlisted =
    optimisticWishlisted !== null ? optimisticWishlisted : serverWishlisted;

  useEffect(() => {
    if (!toggling) {
      setOptimisticWishlisted(null);
    }
  }, [serverWishlisted, toggling]);

  const handleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!courseId || toggling) return;

    const previousValue = wishlisted;
    const nextValue = !previousValue;

    try {
      setToggling(true);
      setOptimisticWishlisted(nextValue); // instant UI update
      await toggleWishlist(courseId);
    } catch (error) {
      console.error("WISHLIST TOGGLE ERROR:", error);
      setOptimisticWishlisted(previousValue); // rollback on error
    } finally {
      setToggling(false);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-3xl border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <Link to={`/courses/${courseId}`} className="block">
          <img
            src={course.image || "https://placehold.co/600x400?text=No+Image"}
            alt={course.title}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />

        <button
          onClick={handleWishlist}
          disabled={!courseId}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/85 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-background/90 dark:hover:bg-background"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              wishlisted
                ? "fill-destructive text-destructive"
                : "text-muted-foreground"
            } ${toggling ? "opacity-80" : ""}`}
          />
        </button>

        <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-4.5rem)] flex-wrap gap-2">
          <Badge
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm ${
              course.isFree
                ? "bg-emerald-500 text-white hover:bg-emerald-500"
                : "bg-primary text-primary-foreground hover:bg-primary"
            }`}
          >
            {course.isFree ? "Free" : `₹${course.price}`}
          </Badge>

          {course.category && (
            <Badge
              variant="outline"
              title={course.category}
              className="max-w-[165px] rounded-full border-white/40 bg-white/85 px-3 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-background/90 md:max-w-[190px]"
            >
              <span className="flex min-w-0 items-center">
                <Tag className="mr-1 h-3 w-3 shrink-0" />
                <span className="truncate">{course.category}</span>
              </span>
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <Link to={`/courses/${courseId}`}>
            <h3 className="line-clamp-2 text-lg font-bold leading-tight tracking-tight text-foreground transition-colors hover:text-primary">
              {course.title}
            </h3>
          </Link>

          <p className="truncate text-sm text-muted-foreground">
            by{" "}
            <span className="font-medium text-foreground/90">
              {instructorName}
            </span>
          </p>

          {course.description && (
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
              {course.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/40 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
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

            <span className="truncate text-xs text-muted-foreground">
              ({course.reviewCount || 0})
            </span>
          </div>

          {course.level && (
            <Badge
              variant="secondary"
              className="shrink-0 rounded-full px-2.5 py-1 text-[11px]"
            >
              {course.level}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background px-3 py-2">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {studentCount.toLocaleString()} students
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background px-3 py-2">
            <Clock3 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {course.duration || "Flexible access"}
            </span>
          </div>

          <div className="col-span-2 flex items-center gap-2 rounded-xl border border-border/70 bg-background px-3 py-2">
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {course.lessons
                ? `${course.lessons} lessons`
                : course.isFree
                ? "Direct enroll available"
                : "Secure payment"}
            </span>
          </div>
        </div>

        {(onUpdate || onDelete) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {onUpdate && courseId && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onUpdate(courseId, {
                    ...course,
                    title: `${course.title} (Updated)`,
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
        )}

        <Button
          className="h-10 w-full rounded-xl font-semibold"
          size="sm"
          asChild
        >
          <Link to={`/courses/${courseId}`}>View Course</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;