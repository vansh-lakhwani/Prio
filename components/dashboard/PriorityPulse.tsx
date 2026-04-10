"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { motion } from "framer-motion";
import { Flame, Zap, Leaf, Target } from "lucide-react";

const PRIORITY_CONFIG = [
  {
    label:    "High Priority",
    sub:      "Critical cycles",
    icon:     Flame,
    gradient: "from-red-400 to-red-500",
    bar:      "from-red-400 to-red-500",
    glow:     "rgba(248,113,113,0.3)",
    text:     "text-red-400",
    bg:       "bg-red-400/10",
    border:   "border-red-400/20",
    badge:    "bg-red-400/15 text-red-400",
  },
  {
    label:    "Standard",
    sub:      "Active work",
    icon:     Zap,
    gradient: "from-orange-400 to-orange-500",
    bar:      "from-orange-400 to-orange-500",
    glow:     "rgba(251,146,60,0.3)",
    text:     "text-orange-400",
    bg:       "bg-orange-400/10",
    border:   "border-orange-400/20",
    badge:    "bg-orange-400/15 text-orange-400",
  },
  {
    label:    "Routine",
    sub:      "Background tasks",
    icon:     Leaf,
    gradient: "from-primary/60 to-primary",
    bar:      "from-primary/60 to-primary",
    glow:     "rgba(var(--primary-rgb),0.3)",
    text:     "text-primary",
    bg:       "bg-primary/10",
    border:   "border-primary/20",
    badge:    "bg-primary/15 text-primary",
  },
];

export function PriorityPulse() {
  const { tasks } = useDashboardStore();
  const pending = tasks.filter(t => t.status !== "done");

  let high = 0, med = 0, low = 0;
  pending.forEach(t => {
    if (t.priority === "high") high++;
    else if (t.priority === "medium") med++;
    else low++;

    t.subtasks?.forEach(s => {
      if (!s.completed) {
        if (s.priority === "high") high++;
        else if (s.priority === "medium") med++;
        else low++;
      }
    });
  });

  const total = (high + med + low) || 1;
  const counts = [high, med, low];

  return (
    <div className="bg-surface-standard rounded-3xl p-6 ring-1 ring-white/5 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black font-display tracking-tight text-foreground">Priority Pulse</h2>
          </div>
          <p className="text-[9px] font-black font-display text-foreground/25 uppercase tracking-[0.25em] ml-10">Load Distribution</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black font-display text-foreground/80">{high + med + low}</div>
          <div className="text-[8px] font-black uppercase tracking-widest text-foreground/25">Total</div>
        </div>
      </div>

      {/* Priority bars */}
      <div className="relative space-y-5">
        {PRIORITY_CONFIG.map((p, i) => {
          const count = counts[i];
          const pct = (count / total) * 100;
          return (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`rounded-2xl p-4 border ${p.border} ${p.bg} relative overflow-hidden`}
              style={{ boxShadow: count > 0 ? `0 4px 24px ${p.glow}` : undefined }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${p.bg} ${p.text}`}>
                    <p.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className={`text-xs font-black ${p.text} uppercase tracking-wider`}>{p.label}</div>
                    <div className="text-[9px] text-foreground/25 font-bold uppercase tracking-widest">{p.sub}</div>
                  </div>
                </div>
                <div className={`text-2xl font-black font-display ${p.text}`}>{count}</div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${p.bar} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, delay: i * 0.15 + 0.3, ease: [0.23, 1, 0.32, 1] }}
                  style={{ boxShadow: count > 0 ? `0 0 8px ${p.glow}` : undefined }}
                />
              </div>

              <div className="mt-2 text-right text-[9px] font-black text-foreground/20 uppercase tracking-widest">
                {Math.round(pct)}%
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom note */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-[0.2em] leading-relaxed">
          Focus on <span className="text-red-400/60 font-black">High Priority</span> cycles to maintain architecture stability.
        </p>
      </div>
    </div>
  );
}
