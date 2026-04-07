"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Zod schemas for validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
});

type AuthMode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const supabase = createClient();

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signin") {
        loginSchema.parse({ email, password });
        
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success("Welcome back!", {
          description: "You have successfully signed in.",
        });
        
        // Pushing to dashboard will be handled by middleware or manually
        router.push("/dashboard");
        
      } else {
        signupSchema.parse({ email, password, fullName });
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        
        toast.success("Account created!", {
          description: "Please check your email to verify your account.",
        });
        
        // Return to sign in mode after successful signup
        setMode("signin");
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        toast.error("Validation Error", {
          description: (err as any).errors[0].message,
        });
      } else {
        toast.error(mode === "signin" ? "Sign In Failed" : "Sign Up Failed", {
          description: err.message || "An unexpected error occurred.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <AnimatePresence mode="popLayout">
          {mode === "signup" && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-foreground/40 text-sm font-semibold">@</span>
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#18221d]/5 border border-outline rounded-xl focus:outline-none focus:border-kinetic focus:ring-1 focus:ring-kinetic transition-all duration-300 text-foreground placeholder-foreground/40 font-medium"
                required={mode === "signup"}
                disabled={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-foreground/40" />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#18221d]/5 border border-outline rounded-xl focus:outline-none focus:border-kinetic focus:ring-1 focus:ring-kinetic transition-all duration-300 text-foreground placeholder-foreground/40 font-medium"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-foreground/40" />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#18221d]/5 border border-outline rounded-xl focus:outline-none focus:border-kinetic focus:ring-1 focus:ring-kinetic transition-all duration-300 text-foreground placeholder-foreground/40 font-medium"
            required
            disabled={isLoading}
          />
        </div>

        {mode === "signin" && (
          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="rounded bg-surface border-outline text-kinetic focus:ring-kinetic/50 focus:ring-offset-surface cursor-pointer" />
              <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">Remember me</span>
            </label>
            <button type="button" className="text-sm font-medium text-kinetic hover:text-verdant-primary transition-colors">
              Forgot password?
            </button>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl verdant-gradient text-background font-bold hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {mode === "signin" ? "Sign In" : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm font-medium text-foreground/60">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-kinetic hover:text-verdant-primary transition-colors font-bold ml-1"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}


