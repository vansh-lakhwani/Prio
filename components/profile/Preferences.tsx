'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Globe, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface PreferencesProps {
  user: any
  profile: any
}

export function Preferences({ user, profile }: PreferencesProps) {
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState({
    timezone: profile?.timezone || 'UTC',
    date_format: profile?.date_format || 'MM/DD/YYYY',
    week_starts_on: profile?.week_starts_on || 'monday'
  })

  const supabase = createClient()

  const handleUpdate = async (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Preference updated!')
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
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-space-grotesk tracking-tight">Account Preferences</h3>
          <p className="text-sm text-foreground/50">Tailor Prio to your lifestyle.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Timezone */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Timezone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => handleUpdate('timezone', e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 rounded-2xl bg-background border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all font-medium appearance-none cursor-pointer"
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
          </div>

          {/* Date Format */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
              <CalendarIcon className="w-3 h-3" />
              Date Format
            </label>
            <select
              value={preferences.date_format}
              onChange={(e) => handleUpdate('date_format', e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 rounded-2xl bg-background border border-outline/10 focus:border-kinetic focus:ring-1 focus:ring-kinetic outline-none transition-all font-medium appearance-none cursor-pointer"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          {/* Week Start */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Week Starts On
            </label>
            <div className="flex bg-background p-1.5 rounded-2xl border border-outline/10">
              {['monday', 'sunday'].map((day) => (
                <button
                  key={day}
                  onClick={() => handleUpdate('week_starts_on', day)}
                  disabled={saving}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    preferences.week_starts_on === day 
                      ? 'bg-kinetic text-background shadow-lg shadow-kinetic/20' 
                      : 'text-foreground/40 hover:text-foreground'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

