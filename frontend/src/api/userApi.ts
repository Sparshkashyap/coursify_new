import API from "@/api/axios";

export const getMyProfile = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const updateMyProfile = async (payload: {
  name: string;
  avatarFile?: File | null;
}) => {
  const formData = new FormData();

  if (payload.name?.trim()) {
    formData.append("name", payload.name.trim());
  }

  if (payload.avatarFile) {
    formData.append("avatar", payload.avatarFile);
  }

  for (const [key, value] of formData.entries()) {
    console.log("FORM DATA:", key, value);
  }

  const res = await API.put("/users/profile", formData);
  return res.data;
};

export const removeMyProfileAvatar = async () => {
  const res = await API.delete("/users/profile/avatar");
  return res.data;
};