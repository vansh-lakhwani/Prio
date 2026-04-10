"use client";

import { useState } from "react";
import { format } from "date-fns";
import { X, Edit2, Calendar as CalendarIcon, Tag, Folder, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/dashboard";
import { useDashboardStore } from "@/stores/dashboardStore";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp, staggerContainer, kineticHover, checkboxVariants } from "@/lib/animations";

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
}

export function TaskDetailModal({ task, onClose, onEdit }: TaskDetailModalProps) {
  const { updateTaskOptimistic } = useDashboardStore();
  const [isHoveringClose, setIsHoveringClose] = useState(false);

  const toggleSubtask = (subtaskId: string) => {
    if (!task.subtasks) return;
    const updatedSubtasks = task.subtasks.map(st => 
       st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTaskOptimistic(task.id, { subtasks: updatedSubtasks, updated_at: new Date().toISOString() });
  };

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`relative flex flex-col w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-2xl bg-surface border-t sm:border border-outline/10 rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden ${isHoveringClose ? 'scale-[0.99] transition-transform' : 'transition-transform'} z-[60]`}
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 flex items-center justify-between p-6 border-b border-outline/10 bg-surface-standard/50"
        >
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  task.priority === 'high' ? 'bg-red-500' :
                  task.priority === 'medium' ? 'bg-amber-500' :
                  task.priority === 'low' ? 'bg-blue-500' : 'bg-outline'
                }`} />
                <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">{task.priority} Priority</span>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               type="button"
               onClick={onEdit}
               className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-[#18221d]/5 border border-outline/10 hover:border-kinetic/50 hover:bg-kinetic/10 hover:text-kinetic rounded-full transition-all"
            >
               <Edit2 className="w-4 h-4" /> Edit
            </motion.button>
            <button 
              type="button"
              onClick={onClose}
              onMouseEnter={() => setIsHoveringClose(true)}
              onMouseLeave={() => setIsHoveringClose(false)}
              className="p-2 -mr-2 text-foreground/40 hover:text-foreground hover:bg-primary/10 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Scrollable Body */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8"
        >
          {/* Title */}
          <motion.div variants={slideUp}>
            <h1 className="text-2xl sm:text-3xl font-bold font-space-grotesk tracking-tight text-foreground break-words leading-tight">
               {task.title}
            </h1>
          </motion.div>

          {/* Metadata Grid */}
          <motion.div variants={slideUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-outline/10">
             {/* Due Date */}
             <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 flex items-center gap-1.5"><CalendarIcon className="w-3 h-3" /> Due Date</span>
                <p className="text-sm font-medium text-foreground/90">
                   {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No due date"}
                </p>
             </div>
             
             {/* Status */}
             <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Status</span>
                <p className="text-sm font-medium capitalize text-foreground/90">
                   {task.status.replace('_', ' ')}
                </p>
             </div>

             {/* Category */}
             <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 flex items-center gap-1.5"><Folder className="w-3 h-3" /> Category</span>
                <p className="text-sm font-medium text-foreground/90">
                   {task.category_id || "Uncategorized"}
                </p>
             </div>

             {/* Labels */}
             <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 flex items-center gap-1.5"><Tag className="w-3 h-3" /> Labels</span>
                {task.labels && task.labels.length > 0 ? (
                   <div className="flex flex-wrap gap-1 mt-0.5">
                     {task.labels.map(l => (
                        <span key={l} className="text-xs px-1.5 py-0.5 bg-[#18221d]/5 border border-outline/10 rounded text-foreground/70">
                          {l}
                        </span>
                     ))}
                   </div>
                ) : (
                   <p className="text-sm font-medium text-foreground/40">None</p>
                )}
             </div>
          </motion.div>

          {/* Description */}
          {task.description && task.description !== '<p></p>' && (
            <motion.div variants={slideUp} className="space-y-3">
               <h3 className="text-xs uppercase tracking-widest font-bold text-foreground/40">Description</h3>
               <div 
                 className="prose prose-invert prose-p:my-1 prose-sm max-w-none text-foreground/80 leading-relaxed bg-[#18221d]/5 p-4 rounded-xl border border-outline/10"
                 dangerouslySetInnerHTML={{ __html: task.description }}
               />
            </motion.div>
          )}

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
             <motion.div variants={slideUp} className="space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs uppercase tracking-widest font-bold text-foreground/40">Checklist</h3>
                   <span className="text-xs font-semibold text-foreground/50">{completedSubtasks}/{totalSubtasks}</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#18221d]/5 rounded-full overflow-hidden border border-outline/10">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="h-full bg-kinetic" 
                    />
                </div>

                <div className="flex flex-col gap-2 mt-4">
                   {task.subtasks.map((st) => (
                      <motion.button
                         key={st.id}
                         whileHover={{ x: 4 }}
                         type="button"
                         onClick={() => toggleSubtask(st.id)}
                         className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${st.completed ? 'bg-kinetic/5 border-kinetic/20' : 'bg-[#18221d]/5 border-outline/10 hover:border-kinetic/50'}`}
                      >
                         <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${st.completed ? 'bg-kinetic border-kinetic/50' : 'border-outline/10 group-hover:border-kinetic/50'}`}>
                            {st.completed && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 bg-background rounded-full"
                              />
                            )}
                         </div>
                         <span className={`text-sm transition-colors ${st.completed ? 'line-through text-foreground/40' : 'text-foreground/90 font-medium'}`}>
                            {st.title}
                         </span>
                      </motion.button>
                   ))}
                </div>
             </motion.div>
          )}
          
        </motion.div>
      </motion.div>
    </div>
  );
}



