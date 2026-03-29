import React, { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewsletterCTA: React.FC = () => {
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

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/newsletter`,
        { email }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Subscribed successfully!");
        setEmail("");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        "Subscription failed";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-10 text-center text-primary-foreground lg:p-16"
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Stay Ahead of the Curve
          </h2>

          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Get the latest courses and updates.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md gap-2"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-primary-foreground/30 bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />

            <Button
              type="submit"
              variant="secondary"
              disabled={loading}
              className="shrink-0 gap-2"
            >
              {loading ? "Submitting..." : "Subscribe"}
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>

      </div>
    </section>
  );
};

export default NewsletterCTA;