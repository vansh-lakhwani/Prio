"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { format, addDays, isSameDay, isToday } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskModal } from "@/hooks/useTaskModal";
import { Calendar, Flame, Zap, Leaf, ChevronRight } from "lucide-react";

const PRIORITY_STYLES = {
  high:   { bar: "bg-accent-warning",   badge: "bg-accent-warning/10 text-accent-warning border-accent-warning/20",    label: "High",   icon: Flame },
  medium: { bar: "bg-accent-earth",  badge: "bg-accent-earth/10 text-accent-earth border-accent-earth/20",  label: "Medium", icon: Zap   },
  low:    { bar: "bg-primary", badge: "bg-primary/10 text-primary border-primary/20", label: "Low",  icon: Leaf  },
  none:   { bar: "bg-foreground/10",  badge: "bg-foreground/5 text-foreground/30 border-foreground/10",   label: "None",  icon: Leaf  },
};

export function UpcomingTasks() {
  const { tasks } = useDashboardStore();
  const { open } = useTaskModal();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedIdx, setSelectedIdx] = useState(0);

  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));

  const filteredTasks = tasks.filter(t => {
    if (!t.due_date || t.status === "done") return false;
    return isSameDay(new Date(t.due_date), selectedDate);
  });

  const handleDateSelect = (date: Date, idx: number) => {
    setSelectedDate(date);
    setSelectedIdx(idx);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-black font-display tracking-tight text-foreground">Timeline</h2>
          <p className="text-xs text-foreground/30 font-semibold uppercase tracking-widest">Future mapping</p>
        </div>
      </div>

      {/* Day selector */}
      <div className="grid grid-cols-7 gap-2 p-3 bg-surface-high/30 rounded-2xl border border-white/5">
        {next7Days.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const taskCount = tasks.filter(t => t.due_date && t.status !== "done" && isSameDay(new Date(t.due_date), date)).length;

          return (
            <motion.button
              key={i}
              onClick={() => handleDateSelect(date, i)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-300 ${
                isSelected
                  ? "bg-primary text-secondary shadow-[0_4px_20px_rgba(var(--primary-rgb),0.3)]"
                  : isTodayDate
                    ? "bg-primary/10 border border-primary/20 text-primary"
                    : "text-foreground/40 hover:bg-surface-standard hover:text-foreground/70"
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-70">
                {format(date, "EEE")}
              </span>
              <span className="text-xl font-black font-display leading-none">{format(date, "d")}</span>
              {taskCount > 0 && (
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-secondary/80" : "bg-primary/50"}`} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected date label */}
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-5 rounded-full bg-primary" />
        <span className="text-sm font-black text-foreground/50 uppercase tracking-widest">
          {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE")} · {format(selectedDate, "MMMM d, yyyy")}
        </span>
        {filteredTasks.length > 0 && (
          <span className="ml-auto text-xs font-black text-primary/60 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Tasks for selected day */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate.toISOString()}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {filteredTasks.length > 0 ? (
            <div className="space-y-2.5">
              {filteredTasks.map((task, idx) => {
                const p = PRIORITY_STYLES[task.priority as keyof typeof PRIORITY_STYLES] ?? PRIORITY_STYLES.none;
                const PIcon = p.icon;
                return (
                  <motion.div
                    layout
                    key={task.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => open(task.id)}
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-surface-high/40 hover:bg-surface-highest/60 border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <div className={`w-1 h-10 rounded-full flex-shrink-0 ${p.bar}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold font-display text-[17px] tracking-tight text-foreground/80 group-hover:text-foreground transition-colors truncate">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${p.badge}`}>
                          <PIcon className="w-3 h-3" />
                          {p.label}
                        </span>
                        {task.due_date && (
                          <span className="text-xs font-semibold text-foreground/30">
                            {format(new Date(task.due_date), "h:mm a")}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/15 group-hover:text-foreground/40 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 rounded-3xl border border-dashed border-white/8">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-4xl mb-4"
              >
                🔭
              </motion.div>
              <p className="font-display font-black uppercase tracking-[0.25em] text-sm text-foreground/25">Uncharted Cycle</p>
              <p className="text-sm text-foreground/15 mt-1">No tasks scheduled for this day</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
