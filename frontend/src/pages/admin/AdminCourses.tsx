import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import {
  getAdminCourses,
  updateAdminCourseStatus,
  deleteAdminCourse,
} from "@/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getAdminCourses({ search, status: statusFilter });
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateAdminCourseStatus(id, status);
      toast.success("Course status updated");
      loadCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this course?");
    if (!confirmed) return;

    try {
      await deleteAdminCourse(id);
      toast.success("Course deleted");
      loadCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Admin Courses</h1>
        <p className="text-sm text-muted-foreground">Moderate all platform courses.</p>
      </motion.div>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Course Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_220px_120px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title"
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={loadCourses}>Search</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>Loading courses...</TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No courses found.</TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.instructor?.name || "Unknown"}</TableCell>
                    <TableCell>{course.isFree ? "Free" : `₹${course.price}`}</TableCell>
                    <TableCell>{course.students?.length || 0}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{course.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Select
                          value={course.status}
                          onValueChange={(value) => handleStatusChange(course._id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(course._id)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default AdminCourses;