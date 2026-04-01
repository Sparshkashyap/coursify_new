import React from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const AppSplashScreen: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.16),transparent_42%),radial-gradient(circle_at_top_left,hsl(var(--accent)/0.08),transparent_30%),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.08),transparent_28%)]" />

      <motion.div
        className="absolute h-[24rem] w-[24rem] rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.45, 0.68, 0.45],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.88,
          y: 16,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          scale: 1.45,
          y: -10,
          filter: "blur(6px)",
        }}
        transition={{
          duration: 0.95,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.div
          className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/20 via-transparent to-transparent" />
          <div className="absolute -inset-3 rounded-[2.3rem] bg-primary/15 blur-2xl" />
          <GraduationCap className="relative z-10 h-11 w-11 text-primary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(5px)" }}
          transition={{
            delay: 0.1,
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
        >
          Coursify
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{
            delay: 0.2,
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-2 text-sm font-medium tracking-wide text-muted-foreground sm:text-base"
        >
          Learn Without Limits
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default AppSplashScreen;