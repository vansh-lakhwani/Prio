"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Hooks & UI
import { useDashboardStore } from "@/stores/dashboardStore";
import { Task, TaskPriority, TaskStatus } from "@/types/dashboard";
import { TipTapEditor } from "@/components/ui/TipTapEditor";
import { DatePicker } from "@/components/ui/DatePicker";
import { PrioritySelector } from "@/components/ui/PrioritySelector";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { LabelMultiSelect } from "@/components/ui/LabelMultiSelect";
import { SubtaskList } from "@/components/ui/SubtaskList";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUp } from "@/lib/animations";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title is too long"),
  description: z.string().optional(),
  priority: z.enum(["none", "low", "medium", "high"]),
  due_date: z.date().nullable(),
  category_id: z.string().nullable(),
  labels: z.array(z.string()),
  subtasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      completed: z.boolean()
    })
  )
});

type TaskFormValues = z.infer<typeof taskSchema>;

const DRAFT_KEY = "prio_task_draft";

interface AddTaskModalProps {
  onClose: () => void;
  defaultStatus?: TaskStatus;
}

export function AddTaskModal({ onClose, defaultStatus = 'todo' }: AddTaskModalProps) {
  const { addTaskOptimistic } = useDashboardStore();
  const [isHoveringClose, setIsHoveringClose] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "none",
      due_date: null,
      category_id: null,
      labels: [],
      subtasks: []
    }
  });

  // LocalStorage Auto-save logic
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.due_date) parsed.due_date = new Date(parsed.due_date);
        reset(parsed);
        setDraftRestored(true);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      // Debounce saving draft
      const timeoutId = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
      }, 2000);
      return () => clearTimeout(timeoutId);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmit(onSubmit)();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: TaskFormValues) => {
    setIsLoading(true);
    
    // 1. Map to exact Database Type Structure
    const newTask: Task = {
      id: uuidv4(),
      user_id: "override-by-auth-hook", // In production, we extract from User context
      title: data.title,
      description: data.description || null,
      status: defaultStatus,
      priority: data.priority as TaskPriority,
      due_date: data.due_date ? data.due_date.toISOString() : null,
      position: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_id: data.category_id,
      labels: data.labels,
      subtasks: data.subtasks
    };

    try {
      // Optimistic Execution
      addTaskOptimistic(newTask);
      
      // Clean up drafts
      localStorage.removeItem(DRAFT_KEY);
      
      toast.success("Task created successfully", {
        icon: <div className="w-4 h-4 rounded-full bg-primary shadow-glow-sm" />
      });
      
      onClose();
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={() => !isLoading && onClose()} 
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
             <h2 className="text-xl font-bold font-space-grotesk tracking-tight">Add New Task</h2>
             {draftRestored && (
                <span className="text-[10px] uppercase tracking-widest font-bold bg-accent-earth/10 text-accent-earth px-2 py-0.5 rounded-full flex items-center gap-1">
                   <RefreshCw className="w-3 h-3" /> Draft restored
                </span>
             )}
          </div>
          <button 
            type="button"
            onClick={onClose}
            onMouseEnter={() => setIsHoveringClose(true)}
            onMouseLeave={() => setIsHoveringClose(false)}
            className="p-2 -mr-2 text-foreground/40 hover:text-accent-warning hover:bg-accent-warning/10 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <motion.form 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            id="add-task-form" 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-8"
          >
            
            {/* Title Block */}
            <motion.div variants={slideUp} className="relative group">
               <Controller
                 name="title"
                 control={control}
                 render={({ field }) => (
                   <input
                     {...field}
                     autoFocus
                     type="text"
                     placeholder="Task Name"
                     className={`w-full bg-transparent text-2xl sm:text-3xl font-bold font-space-grotesk border-b border-transparent focus:border-primary/50 focus:outline-none transition-colors pb-2 placeholder:text-foreground/20 ${errors.title ? 'border-accent-warning/50' : ''}`}
                   />
                 )}
               />
               {errors.title && <span className="absolute -bottom-5 left-0 text-xs font-semibold text-accent-warning">{errors.title.message}</span>}
            </motion.div>

            {/* Matrix Attributes Grid */}
            <motion.div variants={slideUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {/* Left Column (Dates & Categories) */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/40">Due Date</label>
                  <Controller
                    name="due_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/40">Category</label>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <CategorySelect value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
                
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/40 shrink-0">Labels</label>
                  <Controller
                    name="labels"
                    control={control}
                    render={({ field }) => (
                      <LabelMultiSelect value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
              </div>

              {/* Right Column (Priority & Specifics) */}
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/40">Priority Level</label>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <PrioritySelector value={field.value as TaskPriority} onChange={field.onChange} />
                      )}
                    />
                 </div>
              </div>
            </motion.div>

            {/* Rich Description */}
            <motion.div variants={slideUp} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/40">Description Notes</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TipTapEditor value={field.value || ""} onChange={field.onChange} />
                )}
              />
            </motion.div>

            {/* Subtasks Block */}
            <motion.div variants={slideUp} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/40">Checklist</label>
              <Controller
                name="subtasks"
                control={control}
                render={({ field }) => (
                  <SubtaskList value={field.value} onChange={field.onChange} />
                )}
              />
            </motion.div>

          </motion.form>
        </div>

        {/* Footer Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0 p-6 border-t border-outline/10 bg-surface-standard/50 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <span className="text-xs font-semibold text-foreground/30 flex items-center gap-1 hidden sm:flex">
             <kbd className="px-1.5 py-0.5 bg-[#18221d]/10 rounded border border-outline/10 font-sans text-[10px]">Cmd</kbd> + <kbd className="px-1.5 py-0.5 bg-[#18221d]/10 rounded border border-outline/10 font-sans text-[10px]">Enter</kbd> to save
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <button 
               type="button" 
               onClick={onClose} 
               className="flex-1 sm:flex-none px-6 py-2.5 font-bold text-foreground/70 hover:text-foreground transition-colors rounded-xl hover:bg-[#18221d]/5"
             >
               Cancel
             </button>
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               type="submit" 
               form="add-task-form"
               disabled={isLoading}
               className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-2.5 font-bold bg-primary text-background rounded-xl hover:bg-accent-verdant transition-all shadow-lg hover:shadow-primary/20 disabled:pointer-events-none disabled:opacity-50"
             >
               {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               Create Task
             </motion.button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}



