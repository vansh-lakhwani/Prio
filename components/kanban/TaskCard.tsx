"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/dashboard";
import { Calendar, AlertTriangle, CheckCircle2, ChevronRight, Clock, Flame, Zap, Leaf } from "lucide-react";
import { useState } from "react";
import { isToday, isPast, formatDistanceToNow, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useTaskModal } from "@/hooks/useTaskModal";

const PRIORITY_CONFIG = {
  high:   { bar: "bg-red-400/80",   badge: "bg-red-400/10 text-red-400 border-red-400/20",    icon: Flame,  label: "High" },
  medium: { bar: "bg-orange-400/80",  badge: "bg-orange-400/10 text-orange-400 border-orange-400/20",  icon: Zap,    label: "Medium" },
  low:    { bar: "bg-primary/80", badge: "bg-primary/10 text-primary border-primary/20", icon: Leaf, label: "Low" },
  none:   { bar: "bg-foreground/10",  badge: "bg-foreground/5 text-foreground/30 border-foreground/10",  icon: Leaf,   label: "None" },
};

interface TaskCardProps {
  task: Task;
  isDragOverlay?: boolean;
}

export function TaskCard({ task, isDragOverlay }: TaskCardProps) {
  const { open } = useTaskModal();
  const { toggleTaskCompletion } = useDashboardStore();

  const p = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG] ?? PRIORITY_CONFIG.none;
  const PIcon = p.icon;

  const isCompleted = task.status === "done";

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
        colors: ["#799185", "#a2b5ab", "#3f4944", "#ffffff"],
      });
      toast.success("Task completed! 🎉", { duration: 2000 });
    }
    await toggleTaskCompletion(task.id, task.status);
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  // Date logic
  let dateColor = "text-foreground/30";
  let DateIcon = Calendar;
  let dateLabel = "";
  if (task.due_date) {
    const due = new Date(task.due_date);
    dateLabel = format(due, "MMM d");
    if (isPast(due) && !isToday(due) && !isCompleted) {
      dateColor = "text-red-400"; DateIcon = AlertTriangle;
      dateLabel = `Overdue · ${dateLabel}`;
    } else if (isToday(due)) {
      dateColor = "text-orange-400"; DateIcon = Clock;
      dateLabel = `Today · ${dateLabel}`;
    }
  }

  // Age of task
  const age = task.created_at
    ? formatDistanceToNow(new Date(task.created_at), { addSuffix: false })
    : null;

  const subtaskTotal = task.subtasks?.length ?? 0;
  const subtaskDone  = task.subtasks?.filter(s => s.completed).length ?? 0;

  // Ghost while dragging
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[110px] rounded-2xl border border-dashed border-primary/20 bg-primary/5"
      />
    );
  }

  return (
    <>
      <motion.div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        layout
        whileHover={isDragOverlay ? {} : { y: -3, scale: 1.01 }}
        className={`group relative rounded-2xl border border-white/6 hover:border-white/12 cursor-grab active:cursor-grabbing touch-none overflow-hidden transition-all duration-200 ${
          isCompleted ? "opacity-50" : ""
        }`}
        style={{
          ...style,
          background: "rgba(6,11,9,0.7)", // Deep forest bg
          backdropFilter: "blur(12px)",
          boxShadow: isCompleted ? "none" : "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        {/* Top priority stripe */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${p.bar} opacity-70`} />

        <div className="p-4">
          {/* Top row: complete + title */}
          <div className="flex items-start gap-3 mb-3">
            {/* Completion toggle */}
            <button
              onClick={handleComplete}
              className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isCompleted
                  ? "bg-primary border-primary scale-110"
                  : "border-white/20 hover:border-primary/60 hover:scale-110"
              }`}
            >
              <AnimatePresence>
                {isCompleted && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <CheckCircle2 className="w-3 h-3 text-white fill-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Title + open trigger */}
            <div className="flex-1 min-w-0" onClick={() => !isDragOverlay && open(task.id)}>
              <h4 className={`font-display font-bold text-[15px] leading-snug line-clamp-2 transition-all duration-300 ${
                isCompleted ? "text-foreground/25 line-through" : "text-foreground/85 group-hover:text-foreground"
              }`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-xs text-foreground/35 line-clamp-1 mt-0.5 font-medium">
                  {task.description}
                </p>
              )}
            </div>

            {/* Open hint */}
            {!isDragOverlay && (
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-foreground/15 group-hover:text-foreground/40 group-hover:translate-x-0.5 transition-all mt-0.5" />
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority */}
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${p.badge}`}>
                <PIcon className="w-2.5 h-2.5" />
                {p.label}
              </span>

              {/* Due date */}
              {task.due_date && (
                <span className={`flex items-center gap-1 text-[10px] font-bold ${dateColor}`}>
                  <DateIcon className="w-3 h-3" />
                  {dateLabel}
                </span>
              )}
            </div>

            {/* Age */}
            {age && !isCompleted && (
              <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">{age}</span>
            )}
          </div>

          {/* Subtask progress */}
          {subtaskTotal > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/25">Subtasks</span>
                <span className="text-[9px] font-black text-foreground/25">{subtaskDone}/{subtaskTotal}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${p.bar} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${subtaskTotal > 0 ? (subtaskDone / subtaskTotal) * 100 : 0}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>

      </motion.div>
    </>
  );
}
