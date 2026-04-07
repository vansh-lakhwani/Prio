'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Activity, Check, X } from 'lucide-react'
import { useMounted } from '@/lib/hooks/useMounted'

export function RealtimeTests({ userId }: { userId: string }) {
  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const supabase = createClient()
  const mounted = useMounted()

  useEffect(() => {
    const channel = supabase
      .channel('realtime_test_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          setRealtimeEvents(prev => [
            {
              type: payload.eventType,
              timestamp: new Date().toLocaleTimeString(),
              data: payload.new || payload.old,
            },
            ...prev.slice(0, 4), // Keep last 5 events
          ])
        }
      )
      .subscribe((status: any) => {
        setIsSubscribed(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-geist tracking-tight">⚡ Real-time Tests</h2>

      {/* Subscription Status */}
      <div className={`p-4 rounded-xl border-2 mb-6 ${
        isSubscribed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <Check className="h-5 w-5 text-green-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
          <span className="font-semibold text-gray-900">
            {isSubscribed ? 'Real-time Connected' : 'Not Connected'}
          </span>
        </div>
      </div>

      {/* Event Log */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Event Log (Last 5)
        </h3>
        
        {realtimeEvents.length === 0 ? (
          <div className="p-10 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <p className="font-medium">No real-time events yet</p>
            <p className="text-sm mt-1">Create, update, or delete a task to see events</p>
          </div>
        ) : (
          <div className="space-y-3">
            {realtimeEvents.map((event, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    event.type === 'INSERT' ? 'bg-green-100 text-green-700' :
                    event.type === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {event.type}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    {mounted ? event.timestamp : '...'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-mono break-all bg-white p-2 rounded border border-gray-100">
                  {event.data?.title || `Task ID: ${event.data?.id}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Instructions */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          <strong className="block mb-1">To test:</strong> Open this page in another browser window and create/edit/delete a task. 
          Events should appear here instantly.
        </p>
      </div>
    </div>
  )
}
