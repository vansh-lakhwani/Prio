"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { format } from "date-fns";
import { Flame, Zap, Star } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { motion } from "framer-motion";

const quotes = [
  "Small disciplines repeated with consistency every day lead to great achievements.",
  "Your direction is more important than your speed.",
  "Focus on being productive instead of busy.",
  "Don't wait. The time will never be just right.",
  "The secret of getting ahead is getting started.",
];

export function WelcomeCard() {
  const { profile } = useAuth();
  const { stats, tasks } = useDashboardStore();

  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setDateStr(format(new Date(), "EEEE, MMMM d"));
  }, []);

  const completedToday = tasks.filter(t => t.status === "done").length;
  const activeTasks = tasks.filter(t => t.status !== "done").length;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-surface-standard to-indigo-950/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-indigo-600/10" />

      {/* Animated orbs */}
      <motion.div
        className="absolute right-10 top-4 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-40 bottom-2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute left-1/2 top-0 w-32 h-32 bg-cyan-500/8 rounded-full blur-2xl pointer-events-none"
        animate={{ x: [-20, 20, -20], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Border */}
      <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-violet-500/15 pointer-events-none" />

      {/* Left: greeting */}
      <div className="relative z-10 flex-1">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="text-[10px] font-black font-display text-violet-400/60 uppercase tracking-[0.4em]">
            {dateStr || "Command Center"}
          </span>
          <Star className="w-3 h-3 text-violet-400/40" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl lg:text-7xl font-display font-black mb-5 tracking-[-0.03em] leading-[0.9] text-foreground"
        >
          {greeting || "Welcome"},
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[size:200%]">
            {profile?.full_name?.split(" ")[0] || "Architect"}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-foreground/30 font-medium text-base max-w-md leading-relaxed italic border-l-2 border-violet-500/20 pl-5"
        >
          {quote ? `"${quote}"` : "Initializing cycle…"}
        </motion.p>
      </div>

      {/* Right: stats chips */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 flex flex-col gap-3"
      >
        {/* Streak card */}
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-xl p-5 rounded-3xl ring-1 ring-violet-500/20 min-w-[180px]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-glow-amber flex-shrink-0">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-[9px] font-black font-display text-foreground/25 uppercase tracking-[0.2em]">Streak</div>
            <div className="text-3xl font-black font-display text-foreground leading-none">
              {stats?.current_streak || 0}
              <span className="text-xs font-black text-foreground/20 ml-1.5 uppercase tracking-widest">days</span>
            </div>
          </div>
        </div>

        {/* Quick chips row */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-3 py-2 flex-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <div className="text-lg font-black font-display text-emerald-400 leading-none">{completedToday}</div>
              <div className="text-[8px] font-black text-emerald-400/40 uppercase tracking-widest">Done</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-2xl px-3 py-2 flex-1">
            <Star className="w-3.5 h-3.5 text-violet-400" />
            <div>
              <div className="text-lg font-black font-display text-violet-400 leading-none">{activeTasks}</div>
              <div className="text-[8px] font-black text-violet-400/40 uppercase tracking-widest">Active</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
