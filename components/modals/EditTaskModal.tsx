"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Save, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Hooks & UI
import { useDashboardStore } from "@/stores/dashboardStore";
import { Task, TaskPriority } from "@/types/dashboard";
import { TipTapEditor } from "@/components/ui/TipTapEditor";
import { DatePicker } from "@/components/ui/DatePicker";
import { PrioritySelector } from "@/components/ui/PrioritySelector";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { LabelMultiSelect } from "@/components/ui/LabelMultiSelect";
import { SubtaskList } from "@/components/ui/SubtaskList";

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

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

export function EditTaskModal({ task, onClose }: EditTaskModalProps) {
  const { updateTaskOptimistic, removeTaskOptimistic } = useDashboardStore();
  const [isHoveringClose, setIsHoveringClose] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors, isDirty } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      due_date: task.due_date ? new Date(task.due_date) : null,
      category_id: task.category_id || null,
      labels: task.labels || [],
      subtasks: task.subtasks || []
    }
  });

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
    if (!isDirty) {
       onClose();
       return;
    }

    setIsLoading(true);
    
    const updates: Partial<Task> = {
      title: data.title,
      description: data.description || null,
      priority: data.priority as TaskPriority,
      due_date: data.due_date ? data.due_date.toISOString() : null,
      category_id: data.category_id,
      labels: data.labels,
      subtasks: data.subtasks,
      updated_at: new Date().toISOString(),
    };

    try {
      updateTaskOptimistic(task.id, updates);
      
      toast.success("Task updated", {
        icon: <div className="w-4 h-4 rounded-full bg-primary" />
      });
      
      onClose();
    } catch (err) {
      toast.error("Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
     if (window.confirm("Are you sure you want to delete this task?")) {
        removeTaskOptimistic(task.id);
        toast.error("Task deleted");
        onClose();
     }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={() => !isLoading && onClose()} 
      />
      
      <div 
        className={`relative flex flex-col w-full max-w-2xl bg-surface rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 h-[90vh] sm:h-auto sm:max-h-[85vh] ${isHoveringClose ? 'scale-[0.99] transition-transform' : 'transition-transform'}`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-outline/10 bg-surface-standard/50">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold font-space-grotesk tracking-tight">Edit Task</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
               type="button"
               onClick={handleDelete}
               className="p-2 text-foreground/40 hover:text-accent-warning hover:bg-accent-warning/10 rounded-full transition-all"
               title="Delete task"
            >
               <Trash2 className="w-5 h-5" />
            </button>
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
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form id="edit-task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Title Block */}
            <div className="relative group">
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
            </div>

            {/* Matrix Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
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
            </div>

            {/* Rich Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/40">Description Notes</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TipTapEditor value={field.value || ""} onChange={field.onChange} />
                )}
              />
            </div>

            {/* Subtasks Block */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/40">Checklist</label>
              <Controller
                name="subtasks"
                control={control}
                render={({ field }) => (
                  <SubtaskList value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 p-6 border-t border-outline/10 bg-surface-standard/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-foreground/30 flex items-center gap-1 hidden sm:flex">
             {isDirty ? (
                <>
                  <kbd className="px-1.5 py-0.5 bg-[#18221d]/10 rounded border border-outline/10 font-sans text-[10px]">Cmd</kbd> + <kbd className="px-1.5 py-0.5 bg-[#18221d]/10 rounded border border-outline/10 font-sans text-[10px]">Enter</kbd> to save
                </>
             ) : (
                "No changes made"
             )}
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <button 
               type="button" 
               onClick={onClose} 
               className="flex-1 sm:flex-none px-6 py-2.5 font-bold text-foreground/70 hover:text-foreground transition-colors rounded-xl hover:bg-[#18221d]/5"
             >
               Cancel
             </button>
             <button 
               type="submit" 
               form="edit-task-form"
               disabled={isLoading || !isDirty}
               className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-2.5 font-bold bg-primary text-background rounded-xl hover:bg-accent-verdant transition-all shadow-lg hover:shadow-primary/20 disabled:pointer-events-none disabled:opacity-50"
             >
               {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               Save Changes
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}



