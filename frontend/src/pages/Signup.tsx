import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  UserRound,
  BookOpen,
  Briefcase,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
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

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleGoogleSignup = async (credential?: string) => {
    try {
      if (!credential) {
        toast.error("Google signup failed");
        return;
      }

      const data = await googleLogin(credential);

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
      } else {
        toast.error(data.message || "Google signup failed");
      }
    } catch {
      toast.error("Google signup failed");
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
                Create your account
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Choose your role and start your journey
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-5">
            <motion.div variants={item} className="flex justify-center">
              <GoogleLogin
                onSuccess={(res) => handleGoogleSignup(res.credential)}
                onError={() => toast.error("Google signup failed")}
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
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-11 rounded-xl border-border/70 pl-10"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-11 rounded-xl border-border/70 pl-10"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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

            <motion.div variants={item} className="space-y-2">
  <Label>Choose Role</Label>

  <div className="relative inline-grid w-full grid-cols-2 rounded-xl border border-border/70 bg-muted/40 p-1">
    {/* Sliding Background */}
    <div
      className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-primary transition-all duration-300 ${
        formData.role === "student" ? "left-1" : "left-[calc(50%-4px)]"
      }`}
    />

    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({ ...prev, role: "student" }))
      }
      className={`relative z-10 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
        formData.role === "student"
          ? "text-white"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <BookOpen className="h-4 w-4" />
      Student
    </button>

    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({ ...prev, role: "instructor" }))
      }
      className={`relative z-10 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
        formData.role === "instructor"
          ? "text-white"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Briefcase className="h-4 w-4" />
      Instructor
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
                    "Creating account..."
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Create Account
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
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default Signup;