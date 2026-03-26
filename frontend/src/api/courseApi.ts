// /src/api/courseApi.ts
import axios from "axios";

const API_BASE = "/api/courses"; // replace with your backend base URL

export const getMyCourses = () => {
  return axios.get(`${API_BASE}/my-courses`);
};

export const createCourse = (courseData: any) => {
  return axios.post(`${API_BASE}`, courseData);
};

export const updateCourse = (id: string, courseData: any) => {
  return axios.put(`${API_BASE}/${id}`, courseData);
};

export const deleteCourse = (id: string) => {
  return axios.delete(`${API_BASE}/${id}`);
};