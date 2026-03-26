import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, UserRound } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

import { GoogleLogin } from "@react-oauth/google";
import { googleLogin, signupUser } from "@/api/authApi";
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

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const [loading, setLoading] = useState(false);

  const handleError = (msg: string) => {
    toast.error(msg);
  };

  const validateForm = () => {
    const { name, email, password } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      handleError("All fields are required");
      return false;
    }

    if (password.length < 4) {
      handleError("Password must be at least 4 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const data = await signupUser(formData);

      if (data.success) {
        toast.success("Account created successfully");
        setTimeout(() => navigate("/login"), 700);
      } else {
        handleError(data.message);
      }
    } catch (error: any) {
      handleError(error?.response?.data?.message || "Something went wrong");
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
              <CardTitle className="text-2xl">Create an account</CardTitle>
            </motion.div>

            <motion.div variants={item}>
              <CardDescription>Start your learning journey</CardDescription>
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
                      toast.success("Google signup successful");

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
                    toast.error("Google signup failed");
                  }
                }}
                onError={() => toast.error("Google signup failed")}
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
                <Label>Name</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <Label>Account Type</Label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-md border bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </motion.div>

              <motion.div variants={item}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full transition hover:scale-[1.01]"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </motion.div>
            </motion.form>

            <motion.p variants={item} className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default Signup;