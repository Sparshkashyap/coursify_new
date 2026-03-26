import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

import { GoogleLogin } from "@react-oauth/google";
import { googleLogin, loginUser } from "@/api/authApi";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(formData);

      if (data.success) {
        login(data.token, data.user);
        toast.success("Login successful");

        const role = data?.user?.role;

        setTimeout(() => {
          if (role === "admin") navigate("/admin");
          else if (role === "instructor") navigate("/instructor");
          else navigate("/student");
        }, 700);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-2xl" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-md"
      >
        <Card className="border border-gray-200 bg-white/80 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-white/5">
          <CardHeader className="space-y-2 text-center">
            <motion.div variants={item} className="flex justify-center">
              <motion.div whileHover={{ scale: 1.08 }} className="rounded-xl bg-primary/10 p-3">
                <GraduationCap className="h-8 w-8 text-primary" />
              </motion.div>
            </motion.div>

            <motion.div variants={item}>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
            </motion.div>

            <motion.div variants={item}>
              <CardDescription>
                Log in to continue your journey
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.div variants={item} className="flex justify-center">
              <GoogleLogin
                onSuccess={async (res) => {
                  try {
                    const data = await googleLogin(res.credential as string);

                    if (data.success) {
                      login(data.token, data.user);
                      toast.success("Google login successful");

                      const role = data.user.role;

                      navigate(
                        role === "admin"
                          ? "/admin"
                          : role === "instructor"
                          ? "/instructor"
                          : "/student"
                      );
                    }
                  } catch {
                    toast.error("Google login failed");
                  }
                }}
                onError={() => toast.error("Google Login Failed")}
              />
            </motion.div>

            <motion.div variants={item} className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 bg-card px-2 text-xs text-muted-foreground">
                or
              </span>
            </motion.div>

            <motion.form variants={container} onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={item} className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </motion.div>

              <motion.p variants={item} className="text-sm text-muted-foreground">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot Password?
                </Link>
              </motion.p>

              <motion.div variants={item}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full transition hover:scale-[1.01]"
                >
                  {loading ? "Logging in..." : "Log in"}
                </Button>
              </motion.div>
            </motion.form>

            <motion.p variants={item} className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default Login;