'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Globe, Calendar as CalendarIcon, Clock, Loader2, Gauge } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface PreferencesProps {
  user: any
  profile: any
}

export function Preferences({ user, profile }: PreferencesProps) {
  const [saving, setSaving] = useState<string | null>(null)
  const [preferences, setPreferences] = useState({
    timezone: profile?.timezone || 'UTC',
    date_format: profile?.date_format || 'MM/DD/YYYY',
    week_starts_on: profile?.week_starts_on || 'monday'
  })

  const supabase = createClient()

  const handleUpdate = async (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    setSaving(key)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) {
        if (error.message.includes('column') || error.message.includes('not found')) {
           toast.error('Sync Limitation', {
             description: `The "${key}" column is not yet present in the database. Preferences will revert on refresh.`
           })
        } else {
           throw error
        }
      } else {
        toast.success(`${key.replace('_', ' ')} updated!`)
      }
    } catch (error: any) {
      toast.error('Update failed', { description: error.message })
    } finally {
      setSaving(null)
    }
  }

  return (
    <section className="bg-surface/50 backdrop-blur-md border border-outline/10 rounded-[2.5rem] p-8 sm:p-10 shadow-xl relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3.5 rounded-[1.25rem] bg-primary/10 text-primary shadow-inner">
          <Gauge className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-black font-space-grotesk tracking-tight text-foreground">
            Experience Flow
          </h3>
          <p className="text-sm text-foreground/40 font-medium">
            Localize your productivity environment.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Timezone */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-1 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Temporal Zone
            </label>
            <div className="relative group/select">
              <select
                value={preferences.timezone}
                onChange={(e) => handleUpdate('timezone', e.target.value)}
                disabled={saving === 'timezone'}
                className="w-full px-5 py-4 rounded-2xl bg-background/50 border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all font-bold text-foreground appearance-none cursor-pointer group-hover/select:border-outline/30"
              >
                <option value="UTC">UTC (Universal Time)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT/BST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Kolkata">Mumbai (IST)</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/20">
                {saving === 'timezone' ? <Loader2 className="w-4 h-4 animate-spin" /> : '▼'}
              </div>
            </div>
          </div>

          {/* Date Format */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-1 flex items-center gap-2">
              <CalendarIcon className="w-3 h-3" />
              Chronology Format
            </label>
            <div className="relative group/select">
              <select
                value={preferences.date_format}
                onChange={(e) => handleUpdate('date_format', e.target.value)}
                disabled={saving === 'date_format'}
                className="w-full px-5 py-4 rounded-2xl bg-background/50 border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all font-bold text-foreground appearance-none cursor-pointer group-hover/select:border-outline/30"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/20">
                {saving === 'date_format' ? <Loader2 className="w-4 h-4 animate-spin" /> : '▼'}
              </div>
            </div>
          </div>

          {/* Week Start */}
          <div className="space-y-3 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 ml-1 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Cycle Genesis (Week Start)
            </label>
            <div className="flex bg-background/50 p-2 rounded-2xl border border-outline/10 gap-2">
              {['monday', 'sunday'].map((day) => (
                <button
                  key={day}
                  onClick={() => handleUpdate('week_starts_on', day)}
                  disabled={saving === 'week_starts_on'}
                  className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    preferences.week_starts_on === day 
                      ? 'bg-kinetic text-background shadow-lg shadow-kinetic/20' 
                      : 'text-foreground/30 hover:text-foreground/60 hover:bg-surface/50'
                  }`}
                >
                  {saving === 'week_starts_on' && preferences.week_starts_on === day ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

