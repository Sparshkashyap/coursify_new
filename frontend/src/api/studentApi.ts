import API from "@/api/axios";

export const getStudentDashboard = async () => {
  const res = await API.get("/student/dashboard");
  return res.data;
};

export const enrollInFreeCourse = async (courseId: string) => {
  const res = await API.post("/student/enroll-free", { courseId });
  return res.data;
};

export const getStudentCourseAccess = async (courseId: string) => {
  const res = await API.get(`/student/course-access/${courseId}`);
  return res.data;
};


export const completeCourseAndIssueCertificate = async (courseId: string) => {
  const res = await API.post(`/student/complete-course/${courseId}`);
  return res.data;
};

export const getMyCertificates = async () => {
  const res = await API.get("/student/certificates");
  return res.data;
};