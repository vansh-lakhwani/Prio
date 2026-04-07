'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Link2, Calendar, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { syncGoogleCalendar } from '@/lib/actions/calendarSync'
import { motion, AnimatePresence } from 'framer-motion'

interface IntegrationsProps {
  user: any
  profile: any
}

export function Integrations({ user, profile }: IntegrationsProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchSyncSettings()
  }, [])

  const fetchSyncSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("calendar_sync")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (error && error.code !== "PGRST116") throw error

      if (data) {
        setIsEnabled(data.sync_enabled)
        setLastSync(data.last_sync_at)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSync = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from("calendar_sync")
        .upsert({
          user_id: user.id,
          sync_enabled: !isEnabled,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      
      setIsEnabled(!isEnabled)
      toast.success(isEnabled ? "Calendar sync disabled" : "Calendar sync enabled")
      
      if (!isEnabled) {
        handleManualSync()
      }
    } catch (err: any) {
      toast.error("Failed to update sync settings", { description: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSync = async () => {
    setIsSyncing(true)
    const result = await syncGoogleCalendar()
    setIsSyncing(false)

    if (result.success) {
      setLastSync(new Date().toISOString())
      toast.success("Calendar synchronized successfully", {
        description: "Your Prio tasks are now up to date in Google Calendar."
      })
    } else {
      toast.error("Synchronization failed", {
        description: result.error || "Please check your Google permissions."
      })
    }
  }

  return (
    <section className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-kinetic/5 blur-3xl -z-10 rounded-full" />

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-2xl bg-kinetic/10 text-kinetic">
          <Link2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold font-space-grotesk tracking-tight">Integrations</h3>
          <p className="text-sm text-foreground/50">Connect Prio with your favorite tools.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-2xl border border-outline/10 bg-background/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#18221d] shadow-sm border border-outline/5">
                <Calendar className="w-6 h-6 text-[#4285F4]" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-space-grotesk uppercase tracking-tighter">Google Calendar</h4>
                <p className="text-xs text-foreground/50 mt-1">Bi-directional task synchronization.</p>
              </div>
            </div>

            <button
              onClick={toggleSync}
              disabled={isLoading}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                isEnabled ? "bg-kinetic" : "bg-outline/30"
              }`}
            >
              <motion.span
                animate={{ x: isEnabled ? 24 : 4 }}
                className="inline-block h-5 w-5 rounded-full bg-[#18221d] shadow-lg"
              />
            </button>
          </div>

          <AnimatePresence>
            {isEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-outline/10 space-y-4"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-kinetic/5 border border-kinetic/10">
                  <div className="p-1.5 rounded-lg bg-kinetic/10 text-kinetic">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-kinetic">Active</p>
                    <p className="text-xs text-foreground/50 mt-0.5">
                      {lastSync 
                        ? `Last synced: ${new Date(lastSync).toLocaleString()}` 
                        : "Awaiting initial synchronization..."}
                    </p>
                  </div>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="p-2 rounded-xl hover:bg-kinetic/10 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-kinetic ${isSyncing ? "animate-spin" : ""}`} />
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



