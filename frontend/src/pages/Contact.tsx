import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, User, MessageSquare, Send } from "lucide-react";
import { sendMessage } from "@/api/contactApi";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const data = await sendMessage(form);

      if (data.success) {
        toast.success("Message sent successfully");
        setForm({ name: "", email: "", message: "" });
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 py-20">
      <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16 text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl font-bold"
        >
          Contact Us
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.08 }}
          className="mt-2 text-muted-foreground"
        >
          We’d love to hear from you
        </motion.p>
      </section>

      <div className="container mt-10 max-w-2xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.12 }}
        >
          <Card className="rounded-3xl shadow-sm transition hover:shadow-lg">
            <CardContent className="space-y-5 pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-3 rounded-xl border bg-white p-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl border bg-white p-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="flex items-start gap-3 rounded-xl border bg-white p-3">
                  <MessageSquare className="mt-1 h-4 w-4 text-muted-foreground" />
                  <textarea
                    className="min-h-[140px] w-full resize-none border-0 bg-transparent outline-none"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    <Send className="h-4 w-4" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <ToastContainer  autoClose={2000}/>
    </div>
  );
};

export default Contact;