"use client";

import { useEffect, useState } from "react";
import { Calendar, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";
import { syncGoogleCalendar } from "@/lib/actions/calendarSync";
import { toast } from "sonner";

export function CalendarSyncSection() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchSyncSettings();
  }, []);

  const fetchSyncSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("calendar_sync")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setIsEnabled(data.sync_enabled);
        setLastSync(data.last_sync_at);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSync = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("calendar_sync")
        .upsert({
          user_id: user.id,
          sync_enabled: !isEnabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setIsEnabled(!isEnabled);
      toast.success(isEnabled ? "Calendar sync disabled" : "Calendar sync enabled");
      
      if (!isEnabled) {
        handleManualSync();
      }
    } catch (err: any) {
      toast.error("Failed to update sync settings", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    const result = await syncGoogleCalendar();
    setIsSyncing(false);

    if (result.success) {
      setLastSync(new Date().toISOString());
      toast.success("Calendar synchronized successfully", {
        description: "Your Prio tasks are now up to date in Google Calendar."
      });
    } else {
      toast.error("Synchronization failed", {
        description: result.error || "Please check your Google permissions."
      });
    }
  };

  if (isLoading && !isEnabled) {
    return (
      <div className="flex items-center justify-center p-12 bg-surface/50 border border-outline/10 rounded-3xl animate-pulse">
        <Loader2 className="w-6 h-6 animate-spin text-kinetic" />
      </div>
    );
  }

  return (
    <section className="bg-surface rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-xl font-bold font-space-grotesk tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-kinetic" />
            Google Calendar Sync
          </h2>
          <p className="text-sm text-foreground/50 mt-1">
            Keep your tasks and schedule in perfect harmony.
          </p>
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

      <AnimatePresence mode="wait">
        {isEnabled ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-kinetic/5 border border-kinetic/20">
              <div className="p-2 rounded-xl bg-kinetic/10 text-kinetic">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Sync is Active</p>
                <p className="text-xs text-foreground/50">
                  {lastSync 
                    ? `Last synchronized: ${new Date(lastSync).toLocaleString()}` 
                    : "Awaiting initial synchronization..."}
                </p>
              </div>
              <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                onClick={handleManualSync}
                disabled={isSyncing}
                className="p-2 rounded-xl hover:bg-kinetic/10 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-kinetic ${isSyncing ? "animate-spin" : ""}`} />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-outline/10 bg-background/50">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground/30 mb-1">Status</p>
                <p className="text-sm font-medium">Bi-directional</p>
              </div>
              <div className="p-4 rounded-2xl border border-outline/10 bg-background/50">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground/30 mb-1">Calendar</p>
                <p className="text-sm font-medium">Primary</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-2xl border border-dashed border-outline/10 flex flex-col items-center text-center gap-4"
          >
            <div className="p-4 rounded-full bg-surface text-foreground/30">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/70">Syncing is currently disabled.</p>
              <p className="text-xs text-foreground/40 mt-1">
                Enable sync to automatically export your tasks to Google Calendar and pull events into Prio.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Gradient Shimmer */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-kinetic/5 blur-3xl -z-10 rounded-full" />
    </section>
  );
}



