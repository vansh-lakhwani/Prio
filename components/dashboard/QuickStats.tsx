"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { CheckCircle2, Calendar, ListTree, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { isToday } from "date-fns";

function CountUp({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (elapsed < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [to, duration]);

  return <span>{display}</span>;
}

const stats = [
  {
    key:     "completed",
    title:   "Completed",
    sub:     "Tasks done",
    icon:    CheckCircle2,
    gradient: "from-emerald-500 to-teal-400",
    glow:    "rgba(52,211,153,0.25)",
    ring:    "ring-emerald-500/20",
    text:    "text-emerald-400",
    bg:      "bg-emerald-500/10",
    border:  "border-emerald-500/20",
  },
  {
    key:     "today",
    title:   "Due Today",
    sub:     "Need attention",
    icon:    Calendar,
    gradient: "from-amber-500 to-orange-400",
    glow:    "rgba(251,191,36,0.25)",
    ring:    "ring-amber-500/20",
    text:    "text-amber-400",
    bg:      "bg-amber-500/10",
    border:  "border-amber-500/20",
  },
  {
    key:     "subtasks",
    title:   "Subtasks",
    sub:     "Open items",
    icon:    ListTree,
    gradient: "from-violet-500 to-indigo-400",
    glow:    "rgba(129,140,248,0.25)",
    ring:    "ring-violet-500/20",
    text:    "text-violet-400",
    bg:      "bg-violet-500/10",
    border:  "border-violet-500/20",
  },
  {
    key:     "tasks",
    title:   "Active Tasks",
    sub:     "In progress",
    icon:    LayoutGrid,
    gradient: "from-rose-500 to-pink-400",
    glow:    "rgba(251,113,133,0.25)",
    ring:    "ring-rose-500/20",
    text:    "text-rose-400",
    bg:      "bg-rose-500/10",
    border:  "border-rose-500/20",
  },
];

export function QuickStats() {
  const { tasks } = useDashboardStore();

  const values: Record<string, number> = {
    completed: tasks.filter(t => t.status === "done").length,
    today: tasks.filter(t => {
      if (t.status === "done") return false;
      return t.due_date ? isToday(new Date(t.due_date)) : false;
    }).length,
    subtasks: tasks.reduce((acc, t) => {
      if (t.status === "done") return acc;
      return acc + (t.subtasks?.filter(s => !s.completed).length ?? 0);
    }, 0),
    tasks: tasks.filter(t => t.status !== "done").length,
  };

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
          className={`relative overflow-hidden rounded-3xl bg-surface-standard border ${s.border} ring-1 ${s.ring} p-6 hover:scale-[1.02] transition-transform duration-300 cursor-default group`}
          style={{ boxShadow: `0 8px 32px ${s.glow}` }}
        >
          {/* Background gradient blob */}
          <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-2xl`} />
          {/* Shimmer overlay */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl ${s.bg} ${s.text} shadow-lg`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
              {s.sub}
            </div>
          </div>

          <div className={`text-5xl font-black font-display ${s.text} leading-none mb-1`}>
            <CountUp to={values[s.key]} duration={1 + i * 0.1} />
          </div>

          <div className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            {s.title}
          </div>

          {/* Bottom accent bar */}
          <motion.div
            className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${s.gradient}`}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: i * 0.1 + 0.3, ease: "easeOut" }}
          />
        </motion.div>
      ))}
    </div>
  );
}
