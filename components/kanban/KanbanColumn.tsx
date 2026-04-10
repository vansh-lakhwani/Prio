"use client";

import { Task, TaskStatus } from "@/types/dashboard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { useMemo } from "react";
import { motion } from "framer-motion";

const COLUMN_STYLES: Record<TaskStatus, {
  gradient: string;
  dot: string;
  glow: string;
  border: string;
  badge: string;
  emptyText: string;
  emptyIcon: string;
}> = {
  todo:        { gradient: "from-foreground/10 to-transparent",   dot: "bg-foreground/40",   glow: "rgba(255,255,255,0.05)", border: "border-white/5",   badge: "bg-white/5 text-foreground/40", emptyText: "Drop tasks here",     emptyIcon: "📋" },
  in_progress: { gradient: "from-primary/20 to-transparent",        dot: "bg-primary",   glow: "rgba(var(--primary-rgb),0.2)",  border: "border-primary/20",  badge: "bg-primary/15 text-primary", emptyText: "Nothing in flight",  emptyIcon: "⚡" },
  done:        { gradient: "from-primary/30 to-transparent",        dot: "bg-primary font-black", glow: "rgba(var(--primary-rgb),0.3)",   border: "border-primary/30", badge: "bg-primary/20 text-primary", emptyText: "No wins yet",     emptyIcon: "🏆" },
  review:      { gradient: "from-orange-500/20 to-transparent",    dot: "bg-orange-400",   glow: "rgba(251,146,60,0.2)",   border: "border-orange-500/20",   badge: "bg-orange-500/15 text-orange-300",   emptyText: "Nothing to review", emptyIcon: "👀" },
};

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  totalByStatus: Record<TaskStatus, number>;
}

export function KanbanColumn({ status, title, tasks, totalByStatus }: KanbanColumnProps) {
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);
  const s = COLUMN_STYLES[status];

  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "Column", status }
  });

  // Completion % for in-progress column
  const total = totalByStatus.todo + totalByStatus.in_progress + totalByStatus.done;
  const completedPct = total > 0 ? Math.round((totalByStatus.done / total) * 100) : 0;

  return (
    <div
      className={`flex flex-col rounded-3xl border ${s.border} transition-all duration-300 overflow-hidden`}
      style={{
        background: isOver
          ? `linear-gradient(160deg, ${s.glow} 0%, rgba(6,11,9,0.9) 100%)`
          : "rgba(6,11,9,0.7)",
        boxShadow: isOver ? `0 0 0 2px ${s.glow}, 0 24px 64px rgba(0,0,0,0.6)` : "0 4px 32px rgba(0,0,0,0.4)",
        backdropFilter: "blur(24px)",
        minHeight: "100%",
      }}
    >
      {/* Column header */}
      <div className={`px-5 pt-5 pb-4 bg-gradient-to-b ${s.gradient}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              className={`w-3 h-3 rounded-full ${s.dot}`}
              animate={isOver ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.4 }}
              style={{ boxShadow: `0 0 8px ${s.glow}` }}
            />
            <h3 className="font-display font-black text-lg tracking-tight text-foreground/90">{title}</h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${s.badge}`}>
            {tasks.length}
          </span>
        </div>

        {/* Overall progress bar (only show on "done" column) */}
        {status === "done" && total > 0 && (
          <div className="mt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">Board Progress</span>
              <span className="text-[9px] font-black text-primary/70">{completedPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/40 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${completedPct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* In-progress indicator */}
        {status === "in_progress" && tasks.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary/50">Active sprint</span>
          </div>
        )}
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className="flex-1 px-4 py-3 flex flex-col gap-3 overflow-y-auto scrollbar-hide min-h-[160px]"
      >
        <SortableContext id={status} items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 min-h-[120px] rounded-2xl border border-dashed border-white/8 flex flex-col items-center justify-center gap-2"
          >
            <span className="text-2xl">{s.emptyIcon}</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20">{s.emptyText}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
