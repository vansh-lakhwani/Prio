'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database, Download, Upload, Trash2, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface DataManagementProps {
  user: any
  profile: any
}

export function DataManagement({ user, profile }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  
  const supabase = createClient()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Fetch all user data
      const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', user.id)
      const { data: projects } = await supabase.from('projects').select('*').eq('user_id', user.id)
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()

      const exportData = {
        exported_at: new Date().toISOString(),
        user_id: user.id,
        profile: profileData,
        projects: projects || [],
        tasks: tasks || []
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `prio-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Data exported successfully!')
    } catch (error: any) {
      toast.error('Export failed', { description: error.message })
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearData = async () => {
    setIsClearing(true)
    try {
      // Delete tasks (cascades or separate deletes depending on schema)
      const { error: taskError } = await supabase.from('tasks').delete().eq('user_id', user.id)
      if (taskError) throw taskError

      const { error: projectError } = await supabase.from('projects').delete().eq('user_id', user.id)
      if (projectError) throw projectError

      toast.success('All tasks and projects have been cleared.', {
        description: 'You now have a fresh workspace.'
      })
      setShowClearConfirm(false)
      setTimeout(() => window.location.reload(), 1500)
    } catch (error: any) {
      toast.error('Clear data failed', { description: error.message })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <section className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-2xl bg-kinetic/10 text-kinetic">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-space-grotesk tracking-tight">Data Management</h3>
          <p className="text-sm text-foreground/50">Your data belongs to you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export */}
        <div className="p-6 rounded-2xl border border-outline/10 bg-background/50 hover:bg-background/80 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-kinetic text-background shadow-lg shadow-kinetic/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-space-grotesk uppercase tracking-tighter">Export Data</h4>
              <p className="text-xs text-foreground/50 mt-1">Download your tasks in JSON format.</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface text-sm font-bold hover:bg-outline/5 transition-all"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-kinetic" /> : 'Start Export'}
          </button>
        </div>

        {/* Clear Data */}
        <div className="p-6 rounded-2xl border border-outline/10 bg-background/50 hover:bg-background/80 transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-critical/10 text-critical">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-space-grotesk uppercase tracking-tighter">Clear Workspace</h4>
              <p className="text-xs text-foreground/50 mt-1">Remove all tasks and projects.</p>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {!showClearConfirm ? (
              <motion.button
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowClearConfirm(true)}
                className="w-full py-3 rounded-xl bg-critical/5 text-critical border border-critical/20 text-sm font-bold hover:bg-critical hover:text-white transition-all shadow-critical/10"
              >
                Clear All Data
              </motion.button>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3"
              >
                <p className="text-[10px] text-critical font-bold uppercase tracking-widest text-center">Are you absolutely sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-surface text-[10px] font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearData}
                    disabled={isClearing}
                    className="flex-1 py-1.5 rounded-lg bg-critical text-white text-[10px] font-bold uppercase flex items-center justify-center gap-2"
                  >
                    {isClearing ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes, Clear'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

