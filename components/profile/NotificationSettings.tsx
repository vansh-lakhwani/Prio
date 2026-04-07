'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Mail, Smartphone, Calendar, Flame, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface NotificationSettingsProps {
  user: any
  profile: any
}

export function NotificationSettings({ user, profile }: NotificationSettingsProps) {
  const [saving, setSaving] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    email_notifications: profile?.email_notifications ?? true,
    task_reminders: profile?.task_reminders ?? true,
    daily_digest: profile?.daily_digest ?? false,
    streak_reminders: profile?.streak_reminders ?? true
  })

  const supabase = createClient()

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key]
    setSaving(key)
    setSettings(prev => ({ ...prev, [key]: newValue }))

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [key]: newValue, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Notification settings updated!')
    } catch (error: any) {
      toast.error('Update failed', { description: error.message })
      // Revert state
      setSettings(prev => ({ ...prev, [key]: !newValue }))
    } finally {
      setSaving(null)
    }
  }

  const notificationOptions = [
    { 
      id: 'email_notifications', 
      icon: Mail, 
      label: 'Email Notifications', 
      description: 'Receive updates about your account and tasks via email.' 
    },
    { 
      id: 'task_reminders', 
      icon: Calendar, 
      label: 'Task Reminders', 
      description: 'Get notified when tasks are due or reminders are set.' 
    },
    { 
      id: 'daily_digest', 
      icon: Bell, 
      label: 'Daily Digest', 
      description: 'A summary of your upcoming tasks every morning.' 
    },
    { 
      id: 'streak_reminders', 
      icon: Flame, 
      label: 'Streak Reminders', 
      description: 'Don\'t break your productivity streak! Get a nudge.' 
    }
  ]

  return (
    <section className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-2xl bg-kinetic/10 text-kinetic">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-space-grotesk tracking-tight">Notification Settings</h3>
          <p className="text-sm text-foreground/50">Stay in the loop without the noise.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notificationOptions.map((option) => (
          <div 
            key={option.id}
            className={`p-5 rounded-2xl border transition-all ${
              settings[option.id as keyof typeof settings] 
                ? 'border-kinetic bg-kinetic/5 shadow-inner shadow-kinetic/10' 
                : 'border-outline/10 bg-background/50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className={`p-2 rounded-xl h-fit ${
                  settings[option.id as keyof typeof settings] ? 'bg-kinetic text-background' : 'bg-surface text-foreground/20'
                }`}>
                  <option.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-space-grotesk uppercase tracking-tighter">
                    {option.label}
                  </h4>
                  <p className="text-xs text-foreground/50 mt-1 line-clamp-2">
                    {option.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggle(option.id as keyof typeof settings)}
                disabled={saving === option.id}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  settings[option.id as keyof typeof settings] ? "bg-kinetic" : "bg-outline/30"
                }`}
              >
                <span className="sr-only">Toggle {option.label}</span>
                <AnimatePresence>
                  {saving === option.id ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <Loader2 className="w-3 h-3 animate-spin text-background" />
                    </motion.span>
                  ) : (
                    <motion.span
                      animate={{ x: settings[option.id as keyof typeof settings] ? 24 : 4 }}
                      className="inline-block h-4 w-4 rounded-full bg-[#18221d] shadow-lg"
                    />
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}



