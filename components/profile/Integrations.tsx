'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Link2, Calendar, CheckCircle2, AlertCircle, Loader2, RefreshCw, Smartphone, Globe } from 'lucide-react'
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
    <section className="bg-surface/50 backdrop-blur-md border border-outline/10 rounded-[2.5rem] p-8 sm:p-10 shadow-xl relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 rounded-full" />
      
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3.5 rounded-[1.25rem] bg-primary/10 text-primary shadow-inner">
          <Link2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-black font-space-grotesk tracking-tight text-foreground">
            Neural Bridges
          </h3>
          <p className="text-sm text-foreground/40 font-medium">
            Connect Prio with your external productivity nodes.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Google Calendar Integration */}
        <div className={`p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden ${
          isEnabled ? 'border-primary/30 bg-primary/5 shadow-inner' : 'border-outline/10 bg-background/30 hover:bg-background/50'
        }`}>
          {isEnabled && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full" />
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="p-4 rounded-[1.25rem] bg-surface-highest shadow-xl border border-outline/10">
                  <Calendar className="w-8 h-8 text-[#4285F4]" />
                </div>
                {isEnabled && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-lg font-black font-space-grotesk uppercase tracking-widest text-foreground">
                  Google Calendar
                </h4>
                <p className="text-[10px] font-medium text-foreground/40 mt-1 uppercase tracking-widest">
                  Bi-directional Operational Sync
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleSync}
                disabled={isLoading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all focus:outline-none shadow-inner ${
                  isEnabled ? "bg-primary" : "bg-outline/20"
                }`}
              >
                <motion.span
                  animate={{ x: isEnabled ? 28 : 4 }}
                  className="inline-block h-6 w-6 rounded-full bg-surface-highest shadow-xl border border-outline/5"
                />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 pt-8 border-t border-outline/5 space-y-4"
              >
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-background/50 border border-outline/5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Active Channel</p>
                    <p className="text-[11px] font-medium text-foreground/40 mt-0.5">
                      {lastSync 
                        ? `Last Pulse: ${new Date(lastSync).toLocaleString()}` 
                        : "Awaiting initial synchronization cycle..."}
                    </p>
                  </div>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="p-3 rounded-xl hover:bg-primary/10 text-foreground transition-all disabled:opacity-50 group/sync"
                  >
                    <RefreshCw className={`w-5 h-5 transition-transform duration-700 ${isSyncing ? "animate-spin" : "group-hover/sync:rotate-180"}`} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Placeholder for Phone Sync Information */}
        <div className="p-8 rounded-[2rem] border border-outline/5 bg-background/20 group/info hover:bg-background/30 transition-all duration-500">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-[1.25rem] bg-surface-highest/50 text-foreground/20 group-hover/info:text-primary transition-colors duration-500">
              <Smartphone className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-black font-space-grotesk uppercase tracking-widest text-foreground">
                Mobile Synchronization
              </h4>
              <p className="text-[11px] font-medium text-foreground/40 mt-2 leading-relaxed">
                To sync Prio with your smartphone, ensure you have the <span className="text-foreground">Google Calendar App</span> installed. Local Prio tasks are automatically projected onto your primary Google account, which then propagates to your mobile device's native calendar ecosystem.
              </p>
              <div className="mt-4 flex gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-black uppercase tracking-widest text-primary">iOS Compatible</span>
                <span className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-black uppercase tracking-widest text-primary">Android Compatible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



