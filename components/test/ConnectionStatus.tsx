'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Wifi, WifiOff, Database, Check, X, Loader2 } from 'lucide-react'

export function ConnectionStatus({ user }: any) {
  const [status, setStatus] = useState({
    supabase: 'checking',
    realtime: 'checking',
    auth: 'checking',
    database: 'checking',
  })
  const supabase = createClient()

  useEffect(() => {
    checkConnections()
  }, [])

  const checkConnections = async () => {
    // Check Supabase Connection
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1).single()
      setStatus(prev => ({ ...prev, supabase: error ? 'error' : 'success' }))
    } catch {
      setStatus(prev => ({ ...prev, supabase: 'error' }))
    }

    // Check Auth
    setStatus(prev => ({ ...prev, auth: user ? 'success' : 'error' }))

    // Check Database
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id')
        .limit(1)
      setStatus(prev => ({ ...prev, database: error ? 'error' : 'success' }))
    } catch {
      setStatus(prev => ({ ...prev, database: 'error' }))
    }

    // Check Realtime
    const channel = supabase
      .channel('test_channel')
      .subscribe((status: any) => {
        setStatus(prev => ({ 
          ...prev, 
          realtime: status === 'SUBSCRIBED' ? 'success' : 'error' 
        }))
      })

    setTimeout(() => {
      supabase.removeChannel(channel)
    }, 3000)
  }

  const StatusIndicator = ({ status }: { status: string }) => {
    if (status === 'checking') {
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
    }
    if (status === 'success') {
      return <Check className="h-5 w-5 text-green-500" />
    }
    return <X className="h-5 w-5 text-red-500" />
  }

  const getStatusColor = (status: string) => {
    if (status === 'checking') return 'bg-blue-50 border-blue-200'
    if (status === 'success') return 'bg-green-50 border-green-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🔌 Connection Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Supabase Connection */}
        <div className={`border-2 rounded-xl p-4 ${getStatusColor(status.supabase)}`}>
          <div className="flex items-center justify-between mb-2">
            <Database className="h-6 w-6 text-gray-700" />
            <StatusIndicator status={status.supabase} />
          </div>
          <h3 className="font-semibold text-gray-900">Supabase</h3>
          <p className="text-sm text-gray-600 capitalize">{status.supabase}</p>
        </div>

        {/* Authentication */}
        <div className={`border-2 rounded-xl p-4 ${getStatusColor(status.auth)}`}>
          <div className="flex items-center justify-between mb-2">
            <Wifi className="h-6 w-6 text-gray-700" />
            <StatusIndicator status={status.auth} />
          </div>
          <h3 className="font-semibold text-gray-900">Authentication</h3>
          <p className="text-sm text-gray-600 capitalize">{status.auth}</p>
        </div>

        {/* Database */}
        <div className={`border-2 rounded-xl p-4 ${getStatusColor(status.database)}`}>
          <div className="flex items-center justify-between mb-2">
            <Database className="h-6 w-6 text-gray-700" />
            <StatusIndicator status={status.database} />
          </div>
          <h3 className="font-semibold text-gray-900">Database</h3>
          <p className="text-sm text-gray-600 capitalize">{status.database}</p>
        </div>

        {/* Real-time */}
        <div className={`border-2 rounded-xl p-4 ${getStatusColor(status.realtime)}`}>
          <div className="flex items-center justify-between mb-2">
            {status.realtime === 'success' ? (
              <Wifi className="h-6 w-6 text-gray-700" />
            ) : (
              <WifiOff className="h-6 w-6 text-gray-700" />
            )}
            <StatusIndicator status={status.realtime} />
          </div>
          <h3 className="font-semibold text-gray-900">Real-time</h3>
          <p className="text-sm text-gray-600 capitalize">{status.realtime}</p>
        </div>
      </div>

      <button
        onClick={checkConnections}
        className="mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
      >
        Re-check Connections
      </button>
    </div>
  )
}
