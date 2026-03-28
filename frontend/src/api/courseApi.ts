import API from "@/api/axios";

export const getMyCourses = () => {
  return API.get("/courses/my");
};

export const createCourse = (courseData: any) => {
  return API.post("/courses", courseData);
};

export const updateCourse = (id: string, courseData: any) => {
  return API.put(`/courses/${id}`, courseData);
};

export const deleteCourse = (id: string) => {
  return API.delete(`/courses/${id}`);
};