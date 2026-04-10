'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Calendar, Flag, Tag, Plus, Trash2, CheckCircle2, ChevronRight, Layout, ListTree } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Subtask, TaskPriority, Task } from '@/types/dashboard'
import { useDashboardStore } from '@/stores/dashboardStore'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskId?: string | null
  userId: string
}

interface SubtaskFormData extends Partial<Subtask> {
  tempId?: string; // For new subtasks before they get a DB ID
  title: string;
  completed: boolean;
  due_date: string | null;
  priority: TaskPriority;
}

interface TaskFormData {
  title: string
  description: string
  priority: TaskPriority
  status: 'todo' | 'in_progress' | 'done'
  due_date: string
  subtasks: SubtaskFormData[]
}

export function TaskModal({ isOpen, onClose, taskId, userId }: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'none',
    status: 'todo',
    due_date: '',
    subtasks: []
  })
  const [deletedSubtaskIds, setDeletedSubtaskIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTask, setIsLoadingTask] = useState(false)
  const supabase = createClient()
  const { updateTaskOptimistic, addTaskOptimistic } = useDashboardStore()

  useEffect(() => {
    // Only fetch if authenticated and modal is opening/open with an ID
    if (taskId && isOpen && userId) {
      fetchTaskData()
    } else if (!taskId && isOpen) {
      setFormData({
        title: '',
        description: '',
        priority: 'none',
        status: 'todo',
        due_date: '',
        subtasks: []
      })
      setDeletedSubtaskIds([])
    }
  }, [taskId, isOpen, userId])

  const fetchTaskData = async () => {
    if (!taskId || !userId) return;
    
    setIsLoadingTask(true)
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, subtasks(*)')
        .eq('id', taskId)
        .single()

      if (error) {
        // Handle "No rows found" gracefully - could be mid-delete or permission issue
        if (error.code === 'PGRST116') {
          console.warn('[TaskModal] Task entry unreachable or already unmounted.');
          onClose();
          return;
        }
        throw error;
      }

      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          priority: data.priority || 'none',
          status: data.status || 'todo',
          due_date: data.due_date ? data.due_date.split('T')[0] : '',
          subtasks: (data.subtasks || []).map((s: any) => ({
            ...s,
            completed: s.completed || false
          }))
        })
      }
    } catch (error: any) {
      // Don't show toast for session-missing errors during logout/mount
      if (error?.message?.includes('Auth session missing')) return;
      
      console.error('Error fetching task:', error)
      toast.error('Failed to load task details')
    } finally {
      setIsLoadingTask(false)
    }
  }

  const addSubtask = () => {
    const newSubtask: SubtaskFormData = {
      tempId: Math.random().toString(36).substr(2, 9),
      title: '',
      completed: false,
      due_date: formData.due_date || null,
      priority: 'none'
    }
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask]
    }))
  }

  const removeSubtask = (index: number) => {
    const subtask = formData.subtasks[index]
    if (subtask.id) {
      setDeletedSubtaskIds(prev => [...prev, subtask.id!])
    }
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }))
  }

  const updateSubtask = (index: number, updates: Partial<SubtaskFormData>) => {
    setFormData(prev => {
      const newSubtasks = [...prev.subtasks]
      newSubtasks[index] = { ...newSubtasks[index], ...updates }
      return { ...prev, subtasks: newSubtasks }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }

    setIsLoading(true)
    console.log('[TaskModal] Starting save operation...');

    try {
      let savedTaskId = taskId;

      // Optimistic Update for Edit mode
      if (taskId) {
        updateTaskOptimistic(taskId, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          status: formData.status,
          due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
          updated_at: new Date().toISOString()
        });
      }

      // 1. Save Parent Task
      const taskData = {
        user_id: userId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        due_date: formData.due_date || null,
        updated_at: new Date().toISOString(),
      }

      console.log('[TaskModal] Upserting parent task...');
      const { data: taskRes, error: taskError } = taskId 
        ? await supabase.from('tasks').update(taskData).eq('id', taskId).eq('user_id', userId).select().single()
        : await supabase.from('tasks').insert(taskData).select().single()

      if (taskError) {
        console.error('[TaskModal] Error saving task:', taskError);
        throw taskError;
      }
      
      if (!taskRes && !taskId) {
        throw new Error('Save succeeded but no data was returned. Check RLS policies.');
      }
      
      savedTaskId = taskRes?.id || taskId;
      console.log('[TaskModal] Task saved successfully. ID:', savedTaskId);

      // 2. Handle Deleted Subtasks
      if (deletedSubtaskIds.length > 0) {
        console.log('[TaskModal] Removing deleted subtasks:', deletedSubtaskIds.length);
        const { error: delError } = await supabase.from('subtasks').delete().in('id', deletedSubtaskIds)
        if (delError) console.warn('[TaskModal] Minor error deleting subtasks:', delError);
      }

      // 3. Upsert Subtasks
      if (formData.subtasks.length > 0 && savedTaskId) {
        console.log('[TaskModal] Upserting subtasks:', formData.subtasks.length);
        const subtasksToUpsert = formData.subtasks.map(s => ({
          ...(s.id ? { id: s.id } : {}),
          task_id: savedTaskId,
          title: s.title.trim() || 'Untitled Subtask',
          completed: s.completed,
          due_date: s.due_date || null,
          priority: s.priority,
          updated_at: new Date().toISOString()
        }))

        try {
          const { error: subError } = await supabase.from('subtasks').upsert(subtasksToUpsert)
          if (subError) {
            console.error('[TaskModal] Error upserting subtasks (Schema mismatch?):', subError);
            // We toast but don't THROW, allowing the main task to remain saved
            toast.error('Task saved, but subtasks failed to sync. Check schema.');
          }
        } catch (subExc) {
          console.error('[TaskModal] Critical exception during subtask upsert:', subExc);
          toast.error('Partial save: Subtasks could not be processed.');
        }
      }

      toast.success(taskId ? 'Cycle updated' : 'Task initialized')
      console.log('[TaskModal] Save complete. Closing modal.');
      onClose();

    } catch (error: any) {
      console.error('[TaskModal] Submission failed:', error);
      toast.error(error?.message || error?.details || 'Failed to save. Check developer console.');
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!taskId || !confirm('Permanently delete this task and all subtasks?')) return
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId)
      if (error) throw error
      toast.success('Task removed')
      onClose()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'high': return 'bg-red-400/10 text-red-400 border border-red-400/20 shadow-[0_0_20px_rgba(248,113,113,0.05)]'
      case 'medium': return 'bg-orange-400/10 text-orange-400 border border-orange-400/20 shadow-[0_0_20px_rgba(251,146,60,0.05)]'
      case 'low': return 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]'
      default: return 'bg-foreground/5 text-foreground/30 border border-foreground/10'
    }
  }

  const getPriorityDot = (p: TaskPriority) => {
    switch (p) {
      case 'high': return 'bg-red-400'
      case 'medium': return 'bg-orange-400'
      case 'low': return 'bg-primary'
      default: return 'bg-foreground/20'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="relative bg-surface border border-outline/5 rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Layout className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight">
                  {taskId ? 'Modify Cycle' : 'Initialize Task'}
                </h2>
                <p className="text-[10px] text-foreground/40 font-black uppercase tracking-[0.2em]">
                  {taskId ? 'System ID: ' + taskId.slice(0, 8) : 'New Botanical Entry'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/5 rounded-2xl transition-colors group"
            >
              <X className="w-5 h-5 text-foreground/40 group-hover:text-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Core Data */}
              <div className="lg:col-span-7 space-y-10">
                <section className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Task Nomenclature</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Define the primary objective..."
                      className="w-full bg-surface-standard/50 border-none rounded-3xl px-6 py-5 text-xl font-bold text-foreground placeholder:text-foreground/10 focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Architectural Details</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Deconstruct the task requirements here..."
                      rows={4}
                      className="w-full bg-surface-standard/50 border-none rounded-3xl px-6 py-5 text-foreground placeholder:text-foreground/10 focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                    />
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Primary Deadline</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
                      <input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        className="w-full bg-surface-standard/50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all appearance-none shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">System Priority</label>
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: p })}
                          className={`flex-1 py-3 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            formData.priority === p 
                              ? getPriorityColor(p) + ' scale-[1.02]' 
                              : 'bg-surface-standard text-foreground/20 hover:bg-surface-standard/80 border border-outline/5'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] ml-1">Status Phase</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['todo', 'in_progress', 'done'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: s })}
                        className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          formData.status === s 
                            ? 'bg-primary text-secondary shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] border-transparent' 
                            : 'bg-surface-standard text-foreground/20 hover:bg-surface-standard/80 border border-outline/5'
                        }`}
                      >
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Subtasks Decomposition */}
              <div className="lg:col-span-5 bg-white/[0.02] rounded-[2rem] p-6 space-y-6 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ListTree className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Subtask Hierarchy</h3>
                  </div>
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="p-2 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all group"
                  >
                    <Plus className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                  <AnimatePresence initial={false}>
                    {formData.subtasks.map((subtask, index) => (
                      <motion.div
                        key={subtask.id || subtask.tempId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="group flex flex-col gap-3 p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateSubtask(index, { completed: !subtask.completed })}
                            className={`p-1.5 rounded-lg transition-colors ${subtask.completed ? 'bg-primary text-secondary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]' : 'bg-surface-standard text-foreground/10 hover:text-foreground/30 border border-outline/5'}`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <input
                            type="text"
                            value={subtask.title}
                            onChange={(e) => updateSubtask(index, { title: e.target.value })}
                            placeholder="Subtask name..."
                            className={`flex-1 bg-transparent border-none p-0 text-sm font-bold text-foreground placeholder:text-white/10 focus:ring-0 ${subtask.completed ? 'line-through opacity-30' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeSubtask(index)}
                            className="p-1.5 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-red-400/50 hover:text-red-400" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 pl-9">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-foreground/20" />
                            <input
                              type="date"
                              value={subtask.due_date || ''}
                              onChange={(e) => updateSubtask(index, { due_date: e.target.value })}
                              className="bg-transparent border-none p-0 text-[10px] font-black uppercase text-foreground/40 hover:text-foreground/60 transition-colors focus:ring-0 w-24"
                            />
                          </div>

                          <div className="flex gap-1.5">
                            {(['low', 'medium', 'high'] as const).map(p => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => updateSubtask(index, { priority: p })}
                                className={`w-2.5 h-2.5 rounded-full transition-all hover:scale-125 ${subtask.priority === p ? getPriorityDot(p) : 'bg-white/10'}`}
                                title={`${p} priority`}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {formData.subtasks.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <div className="p-4 bg-white/[0.02] rounded-full">
                        <ListTree className="w-8 h-8 text-white/5" />
                      </div>
                      <p className="text-xs font-bold text-white/10 uppercase tracking-widest">No sub-cycles defined</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {taskId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-6 py-3 text-red-400/50 hover:text-red-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                  >
                    Delete Sequence
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3.5 border border-outline/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:bg-surface-standard transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-3.5 bg-primary text-secondary shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.4)] transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : taskId ? 'Commit Changes' : 'Initialize Cycle'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}


