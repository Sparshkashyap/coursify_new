import React, { useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import FeaturedCourses from "@/components/FeaturedCourses";
import TopInstructors from "@/components/TopInstructors";
import StudentReviews from "@/components/StudentReviews";
import CategoryFilter from "@/components/CategoryFilter";
import NewsletterCTA from "@/components/NewsletterCTA";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const Index: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="space-y-16">
      <HeroSection />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        <FeaturedCourses />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.06 }}
      >
        <TopInstructors />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.08 }}
      >
        <StudentReviews />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        <NewsletterCTA />
      </motion.div>
    </div>
  );
};

export default Index;