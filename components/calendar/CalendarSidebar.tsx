"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { GoogleCalendarSync } from "./GoogleCalendarSync";

interface CalendarSidebarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarSidebar({ selectedDate, onSelectDate }: CalendarSidebarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-sm">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex gap-1">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-[#18221d]/10 rounded-md transition text-foreground/70">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-[#18221d]/10 rounded-md transition text-foreground/70">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-[10px] font-bold text-foreground/40 text-center w-full py-1" key={i}>
          {format(addDays(startDate, i), "EEEEEE")}
        </div>
      );
    }

    return <div className="flex w-full grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;

        days.push(
          <div
            className={`w-full flex justify-center py-1.5 cursor-pointer text-xs rounded-lg transition-all ${
              !isSameMonth(day, monthStart)
                ? "text-foreground/20"
                : isSameDay(day, selectedDate)
                ? "bg-kinetic text-background font-bold shadow-md"
                : isToday(day)
                ? "text-kinetic font-bold"
                : "text-foreground/80 hover:bg-[#18221d]/5"
            }`}
            key={day.toString()}
            onClick={() => onSelectDate(cloneDay)}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex w-full grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="hidden lg:flex flex-col w-72 bg-surface-low p-6 gap-10 overflow-y-auto">
      
      {/* Mini Calendar */}
      <div>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      <GoogleCalendarSync />

      {/* Filters (Tactical Hierarchy) */}
      <div>
        <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] font-display mb-4">Filters</h4>
        <div className="space-y-3">
           <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-standard cursor-pointer bg-surface-standard shadow-sm">
              <span className="text-sm font-bold font-sans text-foreground/80">Pro Project</span>
              <div className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                 <Check className="w-3.5 h-3.5 text-surface-lowest" />
              </div>
           </label>
           <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-standard cursor-pointer transition-colors">
              <span className="text-sm font-bold font-sans text-foreground/40">Personal</span>
              <div className="w-5 h-5 rounded-lg border-2 border-surface-highest flex items-center justify-center"></div>
           </label>
        </div>
      </div>
      
      <div className="mt-auto pt-6 border-t border-surface-highest/50">
        <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] font-display mb-4">Intensity</h4>
        <div className="space-y-3 text-[11px] font-bold font-sans">
          <div className="flex items-center gap-3 text-foreground/60"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> High Output</div>
          <div className="flex items-center gap-3 text-foreground/50"><div className="w-2.5 h-2.5 rounded-full bg-primary-container" /> Standard</div>
          <div className="flex items-center gap-3 text-foreground/40"><div className="w-2.5 h-2.5 rounded-full bg-secondary-container" /> Support</div>
        </div>
      </div>
    </div>
  );
}


