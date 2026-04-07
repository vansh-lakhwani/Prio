'use client'

import { TaskModal } from './modals/TaskModal'
import { useTaskModal } from '@/hooks/useTaskModal'
import { Plus } from 'lucide-react'

export function TaskModalWrapper({ userId }: { userId: string }) {
  const { isOpen, taskId, open, close } = useTaskModal()

  return (
    <>
      {/* Floating Add Button */}
      <button
        onClick={() => open()}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-40"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Task Modal */}
      <TaskModal
        isOpen={isOpen}
        onClose={close}
        taskId={taskId}
        userId={userId}
      />
    </>
  )
}
