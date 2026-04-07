'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LayoutGrid, List, SortAsc, Archive, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface TaskPreferencesProps {
  user: any
  profile: any
}

export function TaskPreferences({ user, profile }: TaskPreferencesProps) {
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState({
    default_view: profile?.default_view || 'list',
    default_sort: profile?.default_sort || 'priority',
    auto_archive: profile?.auto_archive ?? true
  })

  const supabase = createClient()

  const handleUpdate = async (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Task preferences updated!')
    } catch (error: any) {
      toast.error('Update failed', { description: error.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-2xl bg-kinetic/10 text-kinetic">
          <LayoutGrid className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-space-grotesk tracking-tight">Task Workflow</h3>
          <p className="text-sm text-foreground/50">Configure your daily workspace.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Default View */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
            Default View
            {saving && <Loader2 className="w-3 h-3 animate-spin text-kinetic" />}
          </label>
          <div className="flex bg-background p-1.5 rounded-2xl border border-outline/10 h-14">
            {[
              { id: 'list', icon: List, label: 'List' },
              { id: 'board', icon: LayoutGrid, label: 'Board' }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => handleUpdate('default_view', view.id)}
                disabled={saving}
                className={`flex-1 flex items-center justify-center gap-3 rounded-xl transition-all font-space-grotesk font-black uppercase tracking-widest text-xs ${
                  preferences.default_view === view.id 
                    ? 'bg-kinetic text-background shadow-lg shadow-kinetic/20' 
                    : 'text-foreground/40 hover:text-foreground'
                }`}
              >
                <view.icon className="w-4 h-4" />
                {view.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sorting */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
              <SortAsc className="w-3 h-3" />
              Default Sorting
            </label>
            <select
              value={preferences.default_sort}
              onChange={(e) => handleUpdate('default_sort', e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 rounded-2xl bg-background border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all font-medium appearance-none cursor-pointer"
            >
              <option value="priority">Priority (High to Low)</option>
              <option value="due_date">Due Date (Earliest First)</option>
              <option value="created_at">Date Created (Newest First)</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Auto-archive */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
              <Archive className="w-3 h-3" />
              Auto-archive
            </label>
            <div 
              onClick={() => handleUpdate('auto_archive', !preferences.auto_archive)}
              className={`flex items-center justify-between p-3 px-4 rounded-2xl border cursor-pointer transition-all ${
                preferences.auto_archive ? 'border-kinetic bg-kinetic/5' : 'border-outline/10'
              }`}
            >
              <span className="text-sm font-medium">Archive after 30 days</span>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${preferences.auto_archive ? 'bg-kinetic' : 'bg-outline/30'}`}>
                <motion.div 
                  animate={{ x: preferences.auto_archive ? 18 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-[#18221d] rounded-full shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



