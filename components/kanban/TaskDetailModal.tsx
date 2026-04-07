"use client";

import { Task } from "@/types/dashboard";
import { X, Calendar, Flag, MessageSquare } from "lucide-react";

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-surface-lowest/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-surface-standard w-full max-w-3xl rounded-[3rem] shadow-2xl shadow-black/40 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 bg-surface-low flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-4xl font-bold font-display tracking-tight text-foreground leading-tight">{task.title}</h2>
            <div className="flex flex-wrap items-center gap-6 mt-4 text-[11px] font-black font-display uppercase tracking-[0.2em] text-foreground/30">
               <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary"/> {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'No given date'}</span>
               <span className="flex items-center gap-2"><Flag className="w-4 h-4 text-primary-container"/> {task.priority} Priority</span>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-surface-highest/50 rounded-2xl text-foreground/30 hover:text-primary transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div>
            <h3 className="text-[12px] font-black font-display uppercase tracking-[0.2em] text-foreground/20 mb-4">Description</h3>
            <p className="text-foreground/60 font-sans text-lg leading-relaxed max-w-2xl">
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="p-12 bg-surface-low rounded-[2.5rem] flex flex-col items-center justify-center text-foreground/20 text-center">
            <MessageSquare className="w-10 h-10 mb-4 opacity-50" />
            <span className="text-[10px] font-black font-display uppercase tracking-[0.3em]">Communication Matrix Integration Pending</span>
          </div>
        </div>

        <div className="p-10 bg-surface-low/50 flex justify-end items-center gap-6">
          <button onClick={onClose} className="px-6 py-2 text-[11px] font-black font-display uppercase tracking-widest text-foreground/30 hover:text-primary transition-colors">Close</button>
          <button className="px-10 py-4 bg-primary text-surface-lowest rounded-2xl font-black font-display text-[12px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Persist Changes</button>
        </div>
      </div>
    </div>
  );
}
