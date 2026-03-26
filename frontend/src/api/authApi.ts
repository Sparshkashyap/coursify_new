import axios from "./axios";




export const signupUser = async (formData:{
  name:string
  email:string
  password:string
  role:string
})=>{

  const {data} = await axios.post("/auth/signup",formData);
  return data;

};


export const loginUser = async (formData: {
  email: string;
  password: string;
}) => {

  const { data } = await axios.post("/auth/login", formData);
  return data;

};


export const forgotPassword = async (email: { email: string }) => {

  const { data } = await axios.post("/auth/forgot-password", email);
  return data;

};


export const resetPassword = async (
  token: string | undefined,
  password: { password: string }
) => {

  const { data } = await axios.post(
    `/auth/reset-password/${token}`,
    password
  );

  return data;

};


export const googleLogin = async (token:string)=>{

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/google-login`,
    
    { token }
  );

  return res.data;

};