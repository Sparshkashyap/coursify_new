import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
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
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGoogleAuth = async (credential?: string) => {
    try {
      if (!credential) {
        toast.error("Google login failed");
        return;
      }

      const data = await googleLogin(credential);

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
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch {
      toast.error("Google login failed");
    }
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
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.10),transparent_30%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.10),transparent_32%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.04)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:radial-gradient(circle_at_center,black_38%,transparent_82%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-md"
      >
        <Card className="overflow-hidden border-border/70 bg-card/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-4 pb-4 text-center">
            <motion.div variants={item} className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="rounded-2xl border border-primary/15 bg-primary/10 p-3 shadow-sm"
              >
                <GraduationCap className="h-8 w-8 text-primary" />
              </motion.div>
            </motion.div>

            <motion.div variants={item} className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Log in to continue your learning journey
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-5">
            <motion.div variants={item} className="flex justify-center">
              <GoogleLogin
                onSuccess={(res) => handleGoogleAuth(res.credential)}
                onError={() => toast.error("Google login failed")}
              />
            </motion.div>

            <motion.div variants={item} className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                or continue with email
              </span>
            </motion.div>

            <motion.form
              variants={container}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-border/70 pl-10"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 rounded-xl border-border/70 pl-10 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center text-muted-foreground transition hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={item} className="pt-1">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl text-sm font-semibold transition-all hover:scale-[1.01]"
                >
                  {loading ? (
                    "Logging in..."
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Log In
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </motion.form>

            <motion.p
              variants={item}
              className="text-center text-sm text-muted-foreground"
            >
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default Login;