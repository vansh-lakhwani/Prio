'use client'

import { useTaskStore } from '@/stores/useTaskStore'
import { useTaskModal } from '@/hooks/useTaskModal'
import { Trash2, CheckCircle2, Circle, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function TaskList() {
  const { tasks } = useTaskStore()
  const { open: openModal } = useTaskModal()
  const supabase = createClient()

  const handleToggleComplete = async (task: any) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id)
      
      if (error) throw error
      // The RealtimeSync component will handle the store update
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
      toast.success('Task deleted')
      // The RealtimeSync component will handle the store update
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-orange-500'
      case 'low': return 'border-l-blue-500'
      default: return 'border-l-gray-300'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Tasks ({tasks.length})
        </h2>
      </div>

      <AnimatePresence mode='popLayout'>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`bg-[#18221d] border-l-4 ${getPriorityColor(task.priority)} rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => handleToggleComplete(task)}
                className="flex-shrink-0 transition-transform active:scale-90"
              >
                {task.status === 'done' ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300 hover:text-green-500" />
                )}
              </button>

              <div className="flex-1">
                <h3 className={`font-semibold text-[#dbe5de] ${task.status === 'done' ? 'line-through text-[#3f4944]' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-[#232c27] text-gray-500 px-2 py-0.5 rounded">
                    {task.status.replace('_', ' ')}
                  </span>
                  {task.priority !== 'none' && (
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                      task.priority === 'high' ? 'bg-red-50 text-red-500' :
                      task.priority === 'medium' ? 'bg-orange-50 text-orange-500' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                  {task.due_date && (
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openModal(task.id)}
                className="p-2 text-[#3f4944] hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Task"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="p-2 text-[#3f4944] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {tasks.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border-2 border-dashed border-[#3f4944] rounded-2xl bg-[#0c1511]/50"
        >
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="h-10 w-10 text-gray-300" />
            <p className="text-gray-500 font-medium">No tasks yet. Create your first task!</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}


