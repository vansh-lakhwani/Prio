'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTaskStore } from '@/stores/useTaskStore'
import { RefreshCw, CheckCircle } from 'lucide-react'

interface RealtimeSyncProps {
  userId: string
}

export function RealtimeSync({ userId }: RealtimeSyncProps) {
  const { setTasks, addTask, updateTask, removeTask } = useTaskStore()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Initial Fetch
    const fetchInitialTasks = async () => {
      setIsSyncing(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching initial tasks:', error)
      } else if (data) {
        setTasks(data)
        setLastSync(new Date())
      }
      setIsSyncing(false)
    }

    fetchInitialTasks()

    // Realtime Subscription
    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          console.log('Realtime change received:', payload)
          setLastSync(new Date())

          if (payload.eventType === 'INSERT') {
            addTask(payload.new as any)
          } else if (payload.eventType === 'UPDATE') {
            updateTask(payload.new.id, payload.new as any)
          } else if (payload.eventType === 'DELETE') {
            removeTask(payload.old.id as string)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase, setTasks, addTask, updateTask, removeTask])

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-[#0c1511] px-3 py-1.5 rounded-full border border-[#3f4944]">
      {isSyncing ? (
        <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
      ) : (
        <CheckCircle className="h-3 w-3 text-green-500" />
      )}
      <span>
        {isSyncing ? 'Syncing...' : `Synced ${lastSync ? lastSync.toLocaleTimeString([]) : 'never'}`}
      </span>
    </div>
  )
}


