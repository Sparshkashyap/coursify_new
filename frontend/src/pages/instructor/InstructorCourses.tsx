import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Download, Eye, Pencil, Plus, Trash2, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "@/api/axios";
import { toast, ToastContainer } from "react-toastify";
import { downloadCourseStudentsCSV } from "@/api/exportApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Course {
  _id: string;
  title: string;
  description?: string;
  image: string;
  video?: string;
  price: number;
  isFree: boolean;
  students?: any[];
}

const InstructorCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/courses/my");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this course?");
    if (!confirmed) return;

    try {
      await API.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success("Course deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage course content, students, and exports.
          </p>
        </div>

        <Button onClick={() => navigate("/instructor/add-course")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Course Library</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No courses found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex flex-col gap-4 rounded-2xl border bg-background p-4 transition hover:shadow-md md:flex-row md:items-center"
                >
                  <img
                    src={course.image || "https://placehold.co/160x90?text=No+Image"}
                    alt={course.title}
                    className="h-24 w-full rounded-xl object-cover md:h-20 md:w-32"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold">{course.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {course.description || "No description available"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge>{course.isFree ? "Free" : `₹${course.price}`}</Badge>
                      {course.video && (
                        <Badge variant="secondary" className="gap-1">
                          <Video className="h-3.5 w-3.5" />
                          Video
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/courses/${course._id}`)} className="gap-1">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => navigate(`/instructor/edit-course/${course._id}`)} className="gap-1">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>

                    <Button size="sm" variant="outline" onClick={() => downloadCourseStudentsCSV(course._id)} className="gap-1">
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>

                    <Button size="sm" variant="destructive" onClick={() => handleDelete(course._id)} className="gap-1">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default InstructorCourses;