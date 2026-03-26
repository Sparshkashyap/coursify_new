import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Target,
  Heart,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const Counter = ({ target }: { target: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}+</span>;
};

const team = [
  { name: "Sarah Chen", role: "CEO & Co-founder", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" },
  { name: "James Wilson", role: "CTO", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { name: "Maria Rodriguez", role: "Head of Design", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  { name: "Alex Kumar", role: "Head of Engineering", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
];

const stats = [
  { icon: BookOpen, value: 10000, label: "Courses" },
  { icon: Users, value: 50000, label: "Students" },
  { icon: Award, value: 200, label: "Instructors" },
  { icon: GraduationCap, value: 15000, label: "Certificates Issued" },
];

const About = () => {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 py-24">
        <div className="container max-w-4xl text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.45 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-sm shadow-sm backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Building the future of learning
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl font-bold lg:text-5xl"
          >
            Our Mission
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            We believe education should be accessible, engaging, and transformative for everyone,
            not just a small group of people with time or money.
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Quality First", desc: "Every course is reviewed with a strong focus on clarity, structure, and usefulness." },
            { icon: Heart, title: "Student-Centered", desc: "We design the platform around real learners, not vanity features." },
            { icon: Award, title: "Industry Recognized", desc: "Certificates and outcomes are built to carry real value in the market." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Card className="h-full rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">
                <CardContent className="space-y-3 pt-6 text-center">
                  <div className="mx-auto w-fit rounded-xl bg-primary/10 p-3">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="rounded-2xl border bg-slate-50 p-6 text-center shadow-sm"
            >
              <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="text-3xl font-bold">
                <Counter target={stat.value} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10 text-center text-3xl font-bold"
          >
            Meet Our Team
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ y: -8 }}
              >
                <Card className="rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">
                  <CardContent className="space-y-4 pt-6 text-center">
                    <Avatar className="mx-auto h-20 w-20">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;