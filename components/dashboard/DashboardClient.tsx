"use client";

import { useEffect, useRef, useState } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { WelcomeCard } from "./WelcomeCard";
import { QuickStats } from "./QuickStats";
import { TodaysTasks } from "./TodaysTasks";
import { UpcomingTasks } from "./UpcomingTasks";
import { AllTasksList } from "./AllTasksList";
import { PriorityPulse } from "./PriorityPulse";
import { Task, UserStats, TaskActivity } from "@/types/dashboard";
import { TaskModal } from "@/components/modals/TaskModal";
import { useTaskModal } from "@/hooks/useTaskModal";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Calendar, ListTodo, Activity } from "lucide-react";

interface DashboardClientProps {
  userId: string;
  initialTasks: Task[];
  initialStats: UserStats | null;
  initialActivity: TaskActivity[];
}

type TabType = "today" | "upcoming" | "all";

export function DashboardClient({ userId, initialTasks, initialStats, initialActivity }: DashboardClientProps) {
  const store = useDashboardStore();
  const { isRealtimeConnected } = store;
  const { isOpen, taskId, close } = useTaskModal();
  const [activeTab, setActiveTab] = useState<TabType>("today");

  // Stable ref to avoid stale closure in useEffect
  const storeRef = useRef(store);
  storeRef.current = store;

  const handleModalClose = () => {
    close();
    // No need to manually refetch. Realtime handles updates, and we don't want to block the transition.
  };

  useEffect(() => {
    storeRef.current.setInitialData(initialTasks, initialStats, initialActivity, userId);
    storeRef.current.initRealtime();
    return () => storeRef.current.cleanupRealtime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty: server pre-loads data, client only inits once


  const tabs = [
    { id: "today", label: "Active Cycle", icon: LayoutGrid },
    { id: "upcoming", label: "Upcoming", icon: Calendar },
    { id: "all", label: "System Catalog", icon: ListTodo },
  ] as const;

  return (
    <>
      <div className="flex flex-col gap-8 lg:gap-12 pb-20">
        {/* Header Section */}
        <section className="space-y-8">
          <WelcomeCard />
          <QuickStats />
        </section>

        {/* Dynamic Board Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Main Area: Cycle Center (Spans 8) */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* Colorful tab bar */}
            <div className="flex p-1.5 bg-surface-low/80 backdrop-blur-xl rounded-2xl w-fit border border-white/5 gap-0.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-black transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-white shadow-lg"
                      : "text-foreground/35 hover:text-foreground/60 hover:bg-surface-standard/50"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 -z-10"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      style={{ boxShadow: "0 4px 20px rgba(129,140,248,0.4)" }}
                    />
                  )}
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live indicator */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isRealtimeConnected ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRealtimeConnected ? 'bg-emerald-400' : 'bg-red-500'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isRealtimeConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
              </span>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isRealtimeConnected ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                {isRealtimeConnected ? "Live" : "Offline"}
              </span>
            </div>

            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "today" && <TodaysTasks />}
                  {activeTab === "upcoming" && <UpcomingTasks />}
                  {activeTab === "all" && <AllTasksList />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <aside className="lg:col-span-3 flex flex-col gap-6">
            <PriorityPulse />
          </aside>

        </div>
      </div>
      

      
      <TaskModal 
        isOpen={isOpen} 
        onClose={handleModalClose} 
        taskId={taskId} 
        userId={userId} 
      />
    </>
  );
}
