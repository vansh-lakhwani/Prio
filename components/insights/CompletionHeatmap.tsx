"use client";

import { useMemo } from "react";
import { TaskActivity } from "@/types/dashboard";
import { subDays, format, eachDayOfInterval, isSameDay, getDay, isAfter } from "date-fns";

interface CompletionHeatmapProps {
  activity: TaskActivity[];
}

export function CompletionHeatmap({ activity }: CompletionHeatmapProps) {
  const data = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 89);
    const rawDays = eachDayOfInterval({ start, end });
    
    // We only care about "completed" actions
    const completions = activity.filter(a => a.action === 'completed');

    return rawDays.map(day => {
       const count = completions.filter(c => isSameDay(new Date(c.created_at), day)).length;
       return {
          date: day,
          count
       };
    });
  }, [activity]);

  // Group into weeks natively
  const weeks: { date: Date, count: number }[][] = [];
  let currentWeek: { date: Date, count: number }[] = [];
  
  data.forEach((day, index) => {
     // If it's the very first element, pad the week with nulls to match weekday alignment
     if (index === 0) {
        const dayOfWeek = getDay(day.date); // 0 (Sun) to 6 (Sat)
        for (let i = 0; i < dayOfWeek; i++) {
           currentWeek.push({ date: subDays(day.date, dayOfWeek - i), count: -1 }); // -1 indicates padding
        }
     }
     
     currentWeek.push(day);
     
     if (getDay(day.date) === 6 || index === data.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
     }
  });

  const getColor = (count: number) => {
     if (count === -1) return 'bg-transparent border-transparent';
     if (count === 0) return 'bg-[#18221d]/5 border-outline/10';
     if (count === 1) return 'bg-kinetic/30 border-kinetic/10';
     if (count <= 3) return 'bg-kinetic/60 border-kinetic/20';
     if (count <= 5) return 'bg-kinetic border-kinetic/50';
     return 'bg-[#059669] border-[#10B981]'; // Extremely productive (darker green kinetic)
  };

  return (
    <div className="w-full bg-surface rounded-3xl p-5 sm:p-6 shadow-sm fade-in-up flex flex-col min-h-[350px]">
       <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold font-space-grotesk tracking-tight text-foreground">Completion Heatmap (90 Days)</h3>
       </div>

       <div className="flex-1 w-full relative flex items-center justify-center overflow-x-auto">
          <div className="flex flex-col gap-1 w-max">
             {/* Weekday Labels */}
             <div className="flex gap-2 text-[10px] uppercase font-bold tracking-widest text-foreground/30 mb-2">
                <span className="w-6 h-6 flex items-center justify-center">S</span>
                <span className="w-6 h-6 flex items-center justify-center">M</span>
                <span className="w-6 h-6 flex items-center justify-center">T</span>
                <span className="w-6 h-6 flex items-center justify-center">W</span>
                <span className="w-6 h-6 flex items-center justify-center">T</span>
                <span className="w-6 h-6 flex items-center justify-center">F</span>
                <span className="w-6 h-6 flex items-center justify-center">S</span>
             </div>
             
             {/* Render Grid rotated 90 deg basically (standard GitHub is horizontal, but vertical works better on mobile/cards unless we row-flex the weeks) */}
             {/* Actually, github is columns of weeks! */}
             <div className="flex gap-1.5 hide-scrollbar">
                {weeks.map((week, wIdx) => (
                   <div key={`w-${wIdx}`} className="flex flex-col gap-1.5">
                      {week.map((day, dIdx) => (
                         <div 
                           key={`d-${wIdx}-${dIdx}`}
                           className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm border transition-all hover:scale-125 cursor-pointer relative group ${getColor(day.count)}`}
                         >
                            {day.count >= 0 && (
                               <div className="opacity-0 group-hover:opacity-100 absolute z-50 bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 bg-surface rounded text-xs whitespace-nowrap shadow-xl pointer-events-none transition-opacity">
                                  <span className="font-bold">{day.count}</span> tasks completed on {format(day.date, "MMM d")}
                               </div>
                            )}
                         </div>
                      ))}
                   </div>
                ))}
             </div>
             
             <div className="flex items-center justify-end gap-2 mt-4 text-[10px] uppercase font-bold tracking-widest text-foreground/40">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-[#18221d]/5 border border-outline/10" />
                <div className="w-3 h-3 rounded-sm bg-kinetic/30 border border-kinetic/10" />
                <div className="w-3 h-3 rounded-sm bg-kinetic border border-kinetic/50" />
                <div className="w-3 h-3 rounded-sm bg-[#059669] border border-[#10B981]" />
                <span>More</span>
             </div>
          </div>
       </div>
    </div>
  );
}



