import axios from "axios";

export const sendMessage = async (form: {
  name: string;
  email: string;
  message: string;
}) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/contact`,
    form
  );
  return res.data;
};