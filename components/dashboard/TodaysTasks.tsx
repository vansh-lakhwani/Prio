"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Sparkles, AlertTriangle, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { useTaskModal } from "@/hooks/useTaskModal";
import confetti from "canvas-confetti";
import { Task } from "@/types/dashboard";
import { format, isToday, isPast } from "date-fns";

const PRIORITY_STYLES = {
  high:   { bar: "bg-rose-500",   badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",    glow: "0 0 0 1px rgba(251,113,133,0.15), 0 4px 24px rgba(251,113,133,0.12)", label: "High",   dot: "bg-rose-500" },
  medium: { bar: "bg-amber-500",  badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",  glow: "0 0 0 1px rgba(251,191,36,0.15),  0 4px 24px rgba(251,191,36,0.12)",  label: "Medium", dot: "bg-amber-500" },
  low:    { bar: "bg-violet-500", badge: "bg-violet-500/15 text-violet-300 border-violet-500/30", glow: "0 0 0 1px rgba(129,140,248,0.15), 0 4px 24px rgba(129,140,248,0.12)", label: "Low",  dot: "bg-violet-500" },
  none:   { bar: "bg-slate-600",  badge: "bg-slate-700/40 text-slate-400 border-slate-600/30",   glow: "0 0 0 1px rgba(100,116,139,0.1)",                                      label: "None",   dot: "bg-slate-500" },
};

export function TodaysTasks() {
  const { tasks, toggleTaskCompletion } = useDashboardStore();
  const { open } = useTaskModal();

  const activeTasks = tasks
    .filter(t => t.status !== "done")
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2, none: 3 };
      const pa = order[a.priority as keyof typeof order] ?? 3;
      const pb = order[b.priority as keyof typeof order] ?? 3;
      if (pa !== pb) return pa - pb;
      if (a.due_date && b.due_date) return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      return 0;
    });

  const handleToggle = async (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status !== "done") {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
        colors: ["#818cf8", "#34d399", "#fbbf24", "#fb7185", "#22d3ee"],
      });
    }
    await toggleTaskCompletion(task.id, task.status);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-2.5 rounded-2xl bg-violet-500/15 text-violet-400"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-black font-display tracking-tight text-foreground">Active Tasks</h2>
            <p className="text-xs text-foreground/30 font-semibold uppercase tracking-widest">
              {activeTasks.length} task{activeTasks.length !== 1 ? "s" : ""} in progress
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-2xl border border-violet-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
          </span>
          <span className="text-xs font-black text-violet-400/70 uppercase tracking-widest">{activeTasks.length} Active</span>
        </div>
      </div>

      {/* Task cards */}
      <AnimatePresence mode="popLayout">
        {activeTasks.length > 0 ? (
          <div className="space-y-3">
            {activeTasks.map((task, idx) => {
              const p = PRIORITY_STYLES[task.priority as keyof typeof PRIORITY_STYLES] ?? PRIORITY_STYLES.none;
              const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));
              const isDueToday = task.due_date && isToday(new Date(task.due_date));
              const subtaskTotal = task.subtasks?.length ?? 0;
              const subtaskDone = task.subtasks?.filter(s => s.completed).length ?? 0;
              const subtaskPct = subtaskTotal > 0 ? (subtaskDone / subtaskTotal) * 100 : 0;

              return (
                <motion.div
                  layout
                  key={task.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -8 }}
                  transition={{ delay: idx * 0.05, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  onClick={() => open(task.id)}
                  className="group relative bg-surface-high/40 hover:bg-surface-highest/60 rounded-2xl border border-white/5 hover:border-white/12 cursor-pointer transition-all duration-300"
                  style={{ boxShadow: p.glow }}
                >
                  {/* Left priority stripe */}
                  <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${p.bar}`} />

                  <div className="flex items-center gap-4 p-5 pl-6">
                    {/* Complete button */}
                    <motion.button
                      onClick={e => handleToggle(task, e)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-surface-standard/80 text-foreground/20 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-300 ring-1 ring-white/8"
                    >
                      <Check className="w-5 h-5" />
                    </motion.button>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold font-display text-lg tracking-tight text-foreground/80 group-hover:text-foreground transition-colors leading-tight">
                        {task.title}
                      </h3>

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {/* Priority */}
                        <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${p.badge}`}>
                          {p.label}
                        </span>

                        {/* Due date */}
                        {task.due_date && (
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue ? "text-rose-400" : isDueToday ? "text-amber-400" : "text-foreground/35"}`}>
                            {isOverdue ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {isOverdue ? "Overdue · " : isDueToday ? "Today · " : ""}{format(new Date(task.due_date), "MMM d, yyyy")}
                          </span>
                        )}

                        {/* Subtask count */}
                        {subtaskTotal > 0 && (
                          <span className="flex items-center gap-1.5 text-xs font-bold text-foreground/30">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {subtaskDone}/{subtaskTotal} subtasks
                          </span>
                        )}
                      </div>

                      {/* Subtask progress */}
                      {subtaskTotal > 0 && (
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${p.bar} rounded-full`}
                              initial={{ width: "0%" }}
                              animate={{ width: `${subtaskPct}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <span className="text-[11px] font-black text-foreground/25 w-8 text-right">{Math.round(subtaskPct)}%</span>
                        </div>
                      )}
                    </div>

                    {/* Arrow hint */}
                    <ChevronRight className="w-4 h-4 text-foreground/15 group-hover:text-foreground/40 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-white/8"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-5 text-emerald-400"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>
            <p className="font-display font-black uppercase tracking-[0.3em] text-sm text-foreground/30">All Clear!</p>
            <p className="text-sm text-foreground/15 mt-2">No active tasks right now</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add button */}
      <motion.button
        onClick={() => open()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-violet-600/25 to-indigo-600/25 text-violet-300 font-black font-display uppercase text-sm tracking-widest hover:from-violet-600/35 hover:to-indigo-600/35 transition-all duration-300 ring-1 ring-violet-500/25 hover:ring-violet-500/50 group"
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        Initialize New Cycle
      </motion.button>
    </div>
  );
}
