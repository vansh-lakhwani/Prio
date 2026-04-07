"use client";

import { useMemo } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { PlusCircle, Edit, CheckCircle2, Trash2, Activity } from "lucide-react";
import { TaskActivity } from "@/types/dashboard";

interface ActivityTimelineProps {
  activity: TaskActivity[];
}

export function ActivityTimeline({ activity }: ActivityTimelineProps) {
  
  const recent = useMemo(() => {
     return activity.slice(0, 20);
  }, [activity]);

  const getActionConfig = (action: string) => {
     switch (action) {
        case 'created':
           return { icon: <PlusCircle className="w-4 h-4 text-blue-500" />, text: "Created task", color: "border-blue-500/20 bg-blue-500/10" };
        case 'updated':
           return { icon: <Edit className="w-4 h-4 text-amber-500" />, text: "Updated task", color: "border-amber-500/20 bg-amber-500/10" };
        case 'completed':
           return { icon: <CheckCircle2 className="w-4 h-4 text-kinetic" />, text: "Completed task", color: "border-kinetic/20 bg-kinetic/10" };
        case 'deleted':
           return { icon: <Trash2 className="w-4 h-4 text-red-500" />, text: "Deleted task", color: "border-red-500/20 bg-red-500/10" };
        default:
           return { icon: <Activity className="w-4 h-4 text-foreground/50" />, text: "Activity", color: "border-outline/10 bg-[#18221d]/5" };
     }
  };

  return (
    <div className="w-full bg-surface rounded-3xl p-5 sm:p-6 shadow-sm fade-in-up flex flex-col h-full min-h-[350px] max-h-[500px]">
       <div className="flex items-center gap-3 mb-6">
          <Activity className="w-5 h-5 text-kinetic" />
          <h3 className="text-base font-bold font-space-grotesk tracking-tight text-foreground">Activity Timeline</h3>
       </div>

       <div className="flex-1 overflow-y-auto pr-2 relative scrollbar-hide">
          {/* Vertical timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-outline/30 z-0" />
          
          <div className="flex flex-col gap-4 relative z-10 w-full">
             {recent.length === 0 ? (
                <div className="text-sm font-semibold text-foreground/30 text-center py-6">No recent activity detected.</div>
             ) : (
                recent.map((act) => {
                   const config = getActionConfig(act.action);
                   return (
                      <div key={act.id} className="flex gap-4 group">
                         <div className={`shrink-0 w-[30px] h-[30px] rounded-full border flex flex-col items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${config.color}`}>
                            {config.icon}
                         </div>
                         <div className="flex flex-col justify-center pb-2 flex-1">
                            <p className="text-sm font-medium text-foreground/90 flex flex-wrap gap-1 leading-snug">
                               <span className="text-foreground/50">{config.text}:</span> 
                               <span className="font-bold text-foreground">
                                  {act.changes?.title || "Unknown Task"}
                               </span>
                            </p>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 mt-1">
                               {formatDistanceToNow(parseISO(act.created_at), { addSuffix: true })}
                            </p>
                         </div>
                      </div>
                   )
                })
             )}
          </div>
       </div>
    </div>
  );
}



