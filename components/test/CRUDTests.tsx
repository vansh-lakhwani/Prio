'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Check, X, Loader2, PlayCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMounted } from '@/lib/hooks/useMounted'

export function CRUDTests({ userId }: { userId: string }) {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isTestingCreate, setIsTestingCreate] = useState(false)
  const [isTestingUpdate, setIsTestingUpdate] = useState(false)
  const [isTestingDelete, setIsTestingDelete] = useState(false)
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null)
  const supabase = createClient()
  const mounted = useMounted()

  const testCreate = async () => {
    setIsTestingCreate(true)
    const testTask = {
      user_id: userId,
      title: `🧪 Test Task ${new Date().getTime()}`,
      description: 'This is a test task created by the integration test suite.',
      status: 'todo',
      priority: 'medium',
      position: 0,
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(testTask)
        .select()
        .single()

      if (error) throw error

      setLastCreatedId(data.id)
      setTestResults(prev => [
        { operation: 'CREATE', status: 'success', detail: `Created task: ${data.title}`, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ])
      toast.success('CREATE Test Passed')
    } catch (error: any) {
      setTestResults(prev => [
        { operation: 'CREATE', status: 'error', detail: error.message, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ])
      toast.error('CREATE Test Failed')
    } finally {
      setIsTestingCreate(false)
    }
  }

  const testUpdate = async () => {
    if (!lastCreatedId) {
      toast.error('Create a task first!')
      return
    }

    setIsTestingUpdate(true)

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          title: `📝 Updated Task ${new Date().getTime()}`,
          status: 'in_progress',
          priority: 'high'
        })
        .eq('id', lastCreatedId)
        .select()
        .single()

      if (error) throw error

      setTestResults(prev => [
        { operation: 'UPDATE', status: 'success', detail: `Updated task: ${data.title}`, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ])
      toast.success('UPDATE Test Passed')
    } catch (error: any) {
      setTestResults(prev => [
        { operation: 'UPDATE', status: 'error', detail: error.message, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ])
      toast.error('UPDATE Test Failed')
    } finally {
      setIsTestingUpdate(false)
    }
  }

  const testDelete = async () => {
    if (!lastCreatedId) {
      toast.error('Create a task first!')
      return
    }

    setIsTestingDelete(true)

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', lastCreatedId)

      if (error) throw error

      setTestResults(prev => [
        { operation: 'DELETE', status: 'success', detail: `Deleted task ID: ${lastCreatedId}`, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ])
      toast.success('DELETE Test Passed')
      setLastCreatedId(null)
    } catch (error: any) {
      setTestResults(prev => [
        { operation: 'DELETE', status: 'error', detail: error.message, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ])
      toast.error('DELETE Test Failed')
    } finally {
      setIsTestingDelete(false)
    }
  }

  const testFullCycle = async () => {
    await testCreate()
    setTimeout(async () => {
      await testUpdate()
      setTimeout(async () => {
        await testDelete()
      }, 1000)
    }, 1000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-geist tracking-tight text-kinetic">🔄 CRUD Operation Tests</h2>

      {/* Test Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={testCreate}
          disabled={isTestingCreate}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-kinetic text-background rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-bold"
        >
          {isTestingCreate ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          Test CREATE
        </button>

        <button
          onClick={testUpdate}
          disabled={isTestingUpdate || !lastCreatedId}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-bold"
        >
          {isTestingUpdate ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Edit className="h-5 w-5" />
          )}
          Test UPDATE
        </button>

        <button
          onClick={testDelete}
          disabled={isTestingDelete || !lastCreatedId}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-bold"
        >
          {isTestingDelete ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Trash2 className="h-5 w-5" />
          )}
          Test DELETE
        </button>

        <button
          onClick={testFullCycle}
          disabled={isTestingCreate || isTestingUpdate || isTestingDelete}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-kinetic to-blue-500 text-background rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-bold"
        >
          <PlayCircle className="h-5 w-5" />
          Full Cycle
        </button>
      </div>

      {/* Current Test Task ID */}
      {lastCreatedId && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6 shadow-inner">
          <p className="text-xs text-blue-800 font-bold uppercase tracking-wider mb-1">Active Test Task</p>
          <code className="block font-mono text-xs text-blue-600 bg-white p-2 rounded border border-blue-200">
            {lastCreatedId}
          </code>
        </div>
      )}

      {/* Test Results */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 tracking-tight">Test Log</h3>
        
        {testResults.length === 0 ? (
          <div className="p-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <p className="font-medium italic">No tests run yet</p>
            <p className="text-xs mt-2">Click a test button above to begin sequence</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 flex items-start gap-4 transition-all hover:scale-[1.01] ${
                  result.status === 'success'
                    ? 'bg-green-50 border-green-100 shadow-sm'
                    : 'bg-red-50 border-red-100 shadow-sm'
                }`}
              >
                {result.status === 'success' ? (
                  <div className="bg-green-500 p-1.5 rounded-full">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="bg-red-500 p-1.5 rounded-full">
                    <X className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 text-sm tracking-tight">{result.operation}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      {mounted ? result.timestamp : '...'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{result.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
