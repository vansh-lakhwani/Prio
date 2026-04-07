"use client";

import { motion, Variants } from "framer-motion";
import { AuthForm } from "./AuthForm";
import { GoogleSignInButton } from "./GoogleSignInButton";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

export function LoginView() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-sm flex flex-col gap-8 relative z-10"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-kinetic/5 blur-[120px] pointer-events-none rounded-full" />
      
      <motion.div variants={itemVariants} className="text-center md:text-left relative">
        <h2 className="text-4xl font-space-grotesk font-black text-foreground tracking-tight">
          Welcome back
        </h2>
        <p className="text-foreground/50 mt-3 font-manrope font-medium">
          Enter your credentials to access your secure workspace.
        </p>
      </motion.div>

      <div className="flex flex-col gap-6 relative">
        <motion.div variants={itemVariants}>
          <GoogleSignInButton />
        </motion.div>

        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-outline/30"></span>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
            <span className="bg-surface px-4 text-foreground/30">
              Or continue with email
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AuthForm />
        </motion.div>
      </div>
    </motion.div>
  );
}
