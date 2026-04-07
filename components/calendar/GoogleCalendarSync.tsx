"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, RefreshCw, CheckCircle2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { createBrowserClient } from "@supabase/ssr";

export function GoogleCalendarSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  
  // In a real execution, we'd trigger Supabase OAuth logic to extract providers
  // For UI implementation, we mock the transition
  
  const handleConnect = async () => {
    setIsSyncing(true);
    // Simulated OAuth flow delay
    setTimeout(() => {
      setIsConnected(true);
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleTimeString());
      toast.success("Google Calendar connected successfully", {
        description: "Events are now syncing in the background via Provider",
      });
    }, 1500);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSynced(new Date().toLocaleTimeString());
      setIsSyncing(false);
      toast.success("Calendar synced successfully");
    }, 800);
  };

  return (
    <div className="bg-surface rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarIcon className="w-4 h-4 text-verdant-primary" />
          Google Calendar
        </div>
        {isConnected && (
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-verdant-primary bg-verdant-primary/10 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Connected
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="space-y-3">
          <p className="text-xs text-foreground/50 leading-relaxed">
            Connect your workspace to see scheduled meetings directly inside your Prio matrix alongside generic tasks.
          </p>
          <button 
            onClick={handleConnect}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 bg-[#18221d] text-black font-semibold py-2 rounded-xl text-sm hover:bg-[#18221d]/90 transition disabled:opacity-50"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {isSyncing ? 'Connecting...' : 'Connect Google Calendar'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground/50">Last synced</span>
            <span className="font-mono text-foreground/80">{lastSynced}</span>
          </div>
          
          <button 
            onClick={handleManualSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 border border-outline/10 hover:bg-[#18221d]/5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>

          <div className="pt-2 border-t border-outline/10 flex items-center justify-between group cursor-pointer">
            <span className="text-xs text-foreground/50 group-hover:text-foreground transition">Advanced Settings</span>
            <ChevronDown className="w-3.5 h-3.5 text-foreground/30 group-hover:text-foreground transition" />
          </div>
        </div>
      )}
    </div>
  );
}



