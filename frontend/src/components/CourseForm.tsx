// /src/components/CourseForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface CourseFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {
      title: "",
      category: "",
      instructor: "",
      price: 0,
      isFree: false,
      level: "Beginner",
      duration: "0h",
      lessons: 0,
      rating: 0,
      students: 0,
      reviewCount: 0,
      image: "",
    },
  });

  const submitHandler = (data: any) => {
    onSubmit(data);
    reset(); // clear form after submit
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-3 p-4 border rounded-md">
      <Input {...register("title")} placeholder="Course Title" required />
      <Input {...register("category")} placeholder="Category" required />
      <Input {...register("instructor")} placeholder="Instructor Name" required />
      <Input type="number" {...register("price")} placeholder="Price" required />
      <Checkbox {...register("isFree")}>Free Course</Checkbox>
      <Input {...register("level")} placeholder="Level (Beginner/Intermediate/Advanced)" />
      <Input {...register("duration")} placeholder="Duration (e.g., 5h)" />
      <Input type="number" {...register("lessons")} placeholder="Number of Lessons" />
      <Input {...register("image")} placeholder="Image URL" />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default CourseForm;