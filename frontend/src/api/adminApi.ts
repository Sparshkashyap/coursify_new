import API from "@/api/axios";

export const getAdminOverview = async () => {
  const res = await API.get("/admin/overview");
  return res.data;
};

export const getAdminUsers = async (params?: { search?: string; role?: string }) => {
  const res = await API.get("/admin/users", { params });
  return res.data;
};

export const updateAdminUserRole = async (id: string, role: string) => {
  const res = await API.patch(`/admin/users/${id}/role`, { role });
  return res.data;
};

export const toggleAdminUserBlock = async (id: string) => {
  const res = await API.patch(`/admin/users/${id}/block`);
  return res.data;
};

export const getAdminCourses = async (params?: { search?: string; status?: string }) => {
  const res = await API.get("/admin/courses", { params });
  return res.data;
};

export const updateAdminCourseStatus = async (id: string, status: string) => {
  const res = await API.patch(`/admin/courses/${id}/status`, { status });
  return res.data;
};

export const deleteAdminCourse = async (id: string) => {
  const res = await API.delete(`/admin/courses/${id}`);
  return res.data;
};

export const getAdminPayments = async () => {
  const res = await API.get("/admin/payments");
  return res.data;
};

export const getAdminSettings = async () => {
  const res = await API.get("/admin/settings");
  return res.data;
};

export const updateAdminSettings = async (payload: {
  commissionPercent: number;
  supportEmail: string;
  maintenanceMode: boolean;
  defaultCurrency: string;
}) => {
  const res = await API.put("/admin/settings", payload);
  return res.data;
};