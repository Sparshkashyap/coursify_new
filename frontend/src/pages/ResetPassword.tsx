import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

import { resetPassword } from "@/api/authApi";

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

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStrength = () => {
    if (password.length < 4) return "Weak";
    if (password.length < 8) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);
      const data = await resetPassword(token, { password });

      if (data.success) {
        toast.success("Password updated successfully");
        setTimeout(() => navigate("/login"), 900);
      } else {
        toast.error(data.message || "Reset failed");
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
              <motion.div whileHover={{ rotate: 8, scale: 1.08 }} className="rounded-xl bg-primary/10 p-3">
                <GraduationCap className="h-8 w-8 text-primary" />
              </motion.div>
            </motion.div>

            <motion.div variants={item}>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
            </motion.div>

            <motion.div variants={item}>
              <CardDescription>Enter your new password</CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.form variants={container} onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={item} className="space-y-2">
                <Label>New Password</Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {password && (
                  <p className="text-xs text-muted-foreground">
                    Strength: {getStrength()}
                  </p>
                )}
              </motion.div>

              <motion.div variants={item}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full transition hover:scale-[1.01]"
                >
                  {loading ? "Updating..." : "Reset Password"}
                </Button>
              </motion.div>
            </motion.form>

            <motion.p variants={item} className="text-center text-sm text-muted-foreground">
              Back to{" "}
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

export default ResetPassword;