"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Task, UserStats, TaskActivity } from "@/types/dashboard";
import { KanbanBoard } from "./KanbanBoard";
import { Search, Filter, AlignJustify } from "lucide-react";

interface KanbanClientWrapperProps {
  initialTasks: Task[];
}

export function KanbanClientWrapper({ initialTasks }: KanbanClientWrapperProps) {
  const { setInitialData, initRealtime, cleanupRealtime, isRealtimeConnected } = useDashboardStore();

  useEffect(() => {
    // We pass empty arrays for non-kanban entities just to satisfy the TS signature.
    // In a broader architectural iteration, initial hydration should be broken into modular actions.
    setInitialData(initialTasks, null, []);
    initRealtime();

    return () => {
      cleanupRealtime();
    };
  }, [initialTasks, setInitialData, initRealtime, cleanupRealtime]);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
      
      {/* Top Banner & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-space-grotesk tracking-tight">Kanban Board</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRealtimeConnected ? 'bg-kinetic' : 'bg-red-500'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isRealtimeConnected ? 'bg-verdant-primary' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">
              {isRealtimeConnected ? 'Live Multi-User Sync' : 'Connecting...'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-kinetic transition-colors" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="pl-9 pr-4 py-2 bg-[#18221d]/5 border border-outline/10 rounded-xl focus:outline-none focus:border-kinetic transition-colors text-sm w-full md:w-48"
            />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 glass border border-outline/10 rounded-xl hover:bg-[#18221d]/5 transition-colors text-sm font-semibold text-foreground/70">
            <Filter className="w-4 h-4" /> Filter
          </button>
          
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 glass border border-outline/10 rounded-xl hover:bg-[#18221d]/5 transition-colors text-sm font-semibold text-foreground/70">
            <AlignJustify className="w-4 h-4" /> List View
          </button>
        </div>
      </div>

      {/* Board Container */}
      <div className="flex-1 min-h-0 w-full">
         <KanbanBoard />
      </div>

    </div>
  );
}



