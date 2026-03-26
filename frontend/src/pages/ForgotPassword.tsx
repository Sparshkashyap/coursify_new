import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

import { forgotPassword } from "@/api/authApi";

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

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      const data = await forgotPassword({ email });

      if (data.success) {
        toast.success(data.message || "Password reset link sent");
      } else {
        toast.error(data.message || "Failed to send reset link");
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
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
            </motion.div>

            <motion.div variants={item}>
              <CardDescription>
                Enter your email and we’ll send you a reset link.
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form variants={container} onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </motion.div>

              <motion.div variants={item}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full transition hover:scale-[1.01]"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </motion.div>
            </motion.form>

            <motion.p variants={item} className="mt-4 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Back to login
              </Link>
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default ForgotPassword;