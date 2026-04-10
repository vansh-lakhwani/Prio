"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Sparkles, AlertTriangle, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { useTaskModal } from "@/hooks/useTaskModal";
import confetti from "canvas-confetti";
import { Task } from "@/types/dashboard";
import { format, isToday, isPast } from "date-fns";

const PRIORITY_STYLES = {
  high:   { bar: "bg-red-400/80",   badge: "bg-red-400/10 text-red-400 border-red-400/20",    glow: "0 0 40px rgba(248,113,113,0.05)", label: "High",   dot: "bg-red-400" },
  medium: { bar: "bg-orange-400/80", badge: "bg-orange-400/10 text-orange-400 border-orange-400/20", glow: "0 0 40px rgba(251,146,60,0.05)", label: "Medium", dot: "bg-orange-400" },
  low:    { bar: "bg-primary/80", badge: "bg-primary/10 text-primary border-primary/20", glow: "0 0 40px rgba(var(--primary-rgb),0.05)", label: "Low",  dot: "bg-primary" },
  none:   { bar: "bg-foreground/10",  badge: "bg-foreground/5 text-foreground/30 border-foreground/10",   glow: "none", label: "None",   dot: "bg-foreground/20" },
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
        colors: ["#799185", "#3f4944", "#a2b5ab", "#dbe5de", "#101a14"],
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
            className="p-2.5 rounded-2xl bg-primary/10 text-primary"
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
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-black text-primary uppercase tracking-widest">{activeTasks.length} Active</span>
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
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-surface-standard/80 text-foreground/20 hover:bg-primary/20 hover:text-primary transition-all duration-300 ring-1 ring-white/5 shadow-inner"
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
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue ? "text-red-400" : isDueToday ? "text-orange-400" : "text-foreground/35"}`}>
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
              className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-5 text-primary"
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
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary/5 text-primary font-black font-display uppercase text-sm tracking-widest hover:bg-primary/10 transition-all duration-300 ring-1 ring-primary/20 group"
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        Initialize New Cycle
      </motion.button>
    </div>
  );
}
