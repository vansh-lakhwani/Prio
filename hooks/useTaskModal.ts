'use client'

import { create } from 'zustand'

interface TaskModalStore {
  isOpen: boolean
  taskId: string | null
  open: (taskId?: string) => void
  close: () => void
}

export const useTaskModal = create<TaskModalStore>((set) => ({
  isOpen: false,
  taskId: null,
  open: (taskId) => set({ isOpen: true, taskId: taskId || null }),
  close: () => set({ isOpen: false, taskId: null }),
}))
