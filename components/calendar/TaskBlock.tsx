"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/dashboard";
import { Clock } from "lucide-react";

interface TaskBlockProps {
  task: Task;
  compact?: boolean;
}

const priorityColors = {
  high: "bg-primary text-surface-lowest shadow-sm",
  medium: "bg-primary-container text-primary",
  low: "bg-secondary-container text-primary/80",
  none: "bg-surface-highest text-foreground/60",
};

export function TaskBlock({ task, compact = false }: TaskBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      type: "CalendarTask",
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="w-full h-8 rounded-xl bg-primary/10 border-2 border-dashed border-primary/30"
      />
    );
  }

  const hasTime = task.due_date && new Date(task.due_date).getHours() !== 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative mb-1.5 w-full rounded-xl cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-all overflow-hidden font-sans ${priorityColors[task.priority]} ${compact ? 'px-2 py-1' : 'px-3 py-1.5'}`}
      title={task.title}
    >
      <div className="flex items-center gap-2">
        {hasTime && !compact && <Clock className="w-3 h-3 opacity-40 flex-shrink-0" />}
        <span className="text-[11px] font-bold leading-tight truncate">
          {task.title}
        </span>
      </div>
      
      {/* Editorial Accent */}
    </div>
  );
}
