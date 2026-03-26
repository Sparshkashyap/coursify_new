import API from "@/api/axios";

export const downloadCourseStudentsCSV = async (courseId: string) => {
  const res = await API.get(`/exports/courses/${courseId}/students-csv`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `course_${courseId}_students.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};