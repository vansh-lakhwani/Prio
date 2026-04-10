"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { format, isPast, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar, CheckCircle2, Clock, AlertTriangle, Pencil, ListTodo, Flame, Zap, Leaf } from "lucide-react";
import { useTaskModal } from "@/hooks/useTaskModal";

const PRIORITY_MAP = {
  high:   { label: "High",   icon: Flame, bar: "bg-accent-warning",    badge: "bg-accent-warning/15 text-accent-warning/80 border-accent-warning/25",       glow: "rgba(248,113,113,0.12)" },
  medium: { label: "Medium", icon: Zap,   bar: "bg-accent-earth", badge: "bg-accent-earth/15 text-accent-earth/80 border-accent-earth/25", glow: "rgba(251,146,60,0.12)"  },
  low:    { label: "Low",    icon: Leaf,  bar: "bg-primary",    badge: "bg-primary/15 text-primary border-primary/25",          glow: "rgba(121,145,133,0.12)" },
  none:   { label: "None",   icon: Leaf,  bar: "bg-surface-highest", badge: "bg-surface-highest/40 text-foreground/30 border-outline/10", glow: "transparent" },
};

export function AllTasksList() {
  const { tasks, deleteTask } = useDashboardStore();
  const { open } = useTaskModal();

  const getDeadline = (dueDate: string | null) => {
    if (!dueDate) return { label: "No deadline", color: "text-foreground/25", icon: Calendar };
    const d = new Date(dueDate);
    if (isPast(d) && !isToday(d)) return { label: `Overdue · ${format(d, "MMM d, yyyy")}`, color: "text-accent-warning", icon: AlertTriangle };
    if (isToday(d))               return { label: `Due Today · ${format(d, "MMM d, yyyy")}`, color: "text-accent-earth", icon: Clock };
    return { label: format(d, "MMM d, yyyy"), color: "text-foreground/35", icon: Calendar };
  };

  const sorted = [...tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (a.status !== "done" && b.status === "done") return -1;
    const order = { high: 0, medium: 1, low: 2, none: 3 };
    return (order[a.priority as keyof typeof order] ?? 3) - (order[b.priority as keyof typeof order] ?? 3);
  });

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "done").length;
  const active = total - completed;

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-display tracking-tight text-foreground">All Tasks</h2>
            <p className="text-xs text-foreground/30 font-semibold uppercase tracking-widest">Complete archive</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col items-center bg-accent-earth/10 border border-accent-earth/20 rounded-2xl px-5 py-2.5">
            <div className="text-2xl font-black font-display text-accent-earth leading-none">{active}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-accent-earth/40 mt-0.5">Active</div>
          </div>
          <div className="flex flex-col items-center bg-primary/10 border border-primary/20 rounded-2xl px-5 py-2.5">
            <div className="text-2xl font-black font-display text-primary leading-none">{completed}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-primary/40 mt-0.5">Done</div>
          </div>
        </div>
      </div>

      {/* Task rows */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {sorted.length > 0 ? (
            sorted.map((task, idx) => {
              const p = PRIORITY_MAP[task.priority as keyof typeof PRIORITY_MAP] ?? PRIORITY_MAP.none;
              const deadline = getDeadline(task.due_date);
              const DIcon = deadline.icon;
              const PIcon = p.icon;
              const isDone = task.status === "done";

              return (
                <motion.div
                  layout
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: idx * 0.025, duration: 0.3 }}
                  className="group relative flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 cursor-pointer border"
                  style={{
                    background: isDone ? "rgba(7,16,12,0.3)" : "rgba(12,21,17,0.5)",
                    borderColor: isDone ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                    boxShadow: isDone ? undefined : `0 2px 20px ${p.glow}`,
                    opacity: isDone ? 0.55 : 1,
                  }}
                  onClick={() => open(task.id)}
                >
                  {/* Priority stripe */}
                  <div className={`w-1 h-12 rounded-full flex-shrink-0 ${isDone ? "bg-white/10" : p.bar}`} />

                  {/* Text content — full width */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold font-display text-[17px] tracking-tight truncate leading-tight ${isDone ? "text-foreground/25 line-through decoration-white/20" : "text-foreground/80 group-hover:text-foreground"} transition-colors`}>
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {/* Status or priority */}
                      {isDone ? (
                        <span className="flex items-center gap-1.5 text-xs font-black text-primary/60 uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      ) : (
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${p.badge}`}>
                          <PIcon className="w-3 h-3" />
                          {p.label}
                        </span>
                      )}

                      {/* Deadline */}
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${deadline.color}`}>
                        <DIcon className="w-3.5 h-3.5" />
                        {deadline.label}
                      </span>

                      {/* Subtasks */}
                      {(task.subtasks?.length ?? 0) > 0 && (
                        <span className="text-xs font-semibold text-foreground/25">
                          {task.subtasks!.filter(s => s.completed).length}/{task.subtasks!.length} subtasks
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions — visible on hover */}
                   <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={e => { e.stopPropagation(); open(task.id); }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground/20 hover:text-primary hover:bg-primary/10 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground/20 hover:text-accent-warning hover:bg-accent-warning/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-white/8 opacity-25">
              <ListTodo className="w-12 h-12 mb-4" />
              <p className="font-display font-black uppercase tracking-[0.25em] text-sm">No tasks yet</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
