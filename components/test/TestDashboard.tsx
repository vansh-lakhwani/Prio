'use client'

import { useTaskModal } from '@/hooks/useTaskModal'
import { TaskModal } from '@/components/modals/TaskModal'
import { Plus, AppWindow } from 'lucide-react'

export function TestDashboard({ userId }: { userId: string }) {
  const { isOpen, taskId, open, close } = useTaskModal()

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full transition-all hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 font-geist tracking-tight">
        <AppWindow className="h-7 w-7 text-kinetic" />
        Task Modal Test
      </h2>
      
      <div className="space-y-6">
        <button
          onClick={() => open()}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-tr from-kinetic to-green-600 text-background rounded-xl font-bold hover:shadow-lg active:scale-[0.98] transition-all group"
        >
          <Plus className="h-5 w-5 transform group-hover:rotate-90 transition-transform" />
          Open Task Creation Modal
        </button>

        <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-4 shadow-inner">
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Test the main task management interface by opening the modal manually. 
            This verifies that:
          </p>
          <ul className="space-y-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-kinetic rounded-full" />
              Modal state management via hooks
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-kinetic rounded-full" />
              Dynamic form field rendering
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-kinetic rounded-full" />
              Zustand store integration
            </li>
          </ul>
        </div>
      </div>

      <TaskModal
        isOpen={isOpen}
        onClose={close}
        taskId={taskId}
        userId={userId}
      />
    </div>
  )
}
