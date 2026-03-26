import { motion } from "framer-motion";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  { q: "How do I enroll in a course?", a: "Go to the course page and click the enroll button. Paid courses will require payment before access is granted." },
  { q: "Do I get a certificate?", a: "Yes, if the course supports certification and you complete all required lessons or assessments." },
  { q: "How can I become an instructor?", a: "Sign up with an instructor account or upgrade your existing account through the dashboard when that option is available." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Help = () => {
  return (
    <div className="bg-slate-50 py-20">
      <section className="bg-gradient-to-br from-primary/10 to-accent/5 py-16 text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl font-bold"
        >
          Help Center
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.08 }}
          className="mt-2 text-muted-foreground"
        >
          Find quick answers to common questions.
        </motion.p>
      </section>

      <div className="container mt-10 max-w-3xl space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <Card className="rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="pt-5">
                <h3 className="flex items-center gap-2 font-semibold">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {faq.a}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-dashed bg-white p-6 text-center"
        >
          <MessageCircleQuestion className="mx-auto mb-3 h-6 w-6 text-primary" />
          <p className="text-sm text-muted-foreground">
            Still stuck? Reach out through the contact page and we’ll help you directly.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;