"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Task } from "@/types/dashboard";
import { CalendarView } from "./CalendarView";

interface CalendarClientWrapperProps {
  initialTasks: Task[];
}

export function CalendarClientWrapper({ initialTasks }: CalendarClientWrapperProps) {
  const { setInitialData, initRealtime, cleanupRealtime } = useDashboardStore();

  useEffect(() => {
    setInitialData(initialTasks, null, []);
    initRealtime();

    return () => {
      cleanupRealtime();
    };
  }, [initialTasks, setInitialData, initRealtime, cleanupRealtime]);

  return (
    <div className="flex flex-col h-full w-full">
      <CalendarView />
    </div>
  );
}
