"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Edit3, PlusCircle, Trash2, Activity } from "lucide-react";
import { motion } from "framer-motion";

const actionIcons = {
  created: { icon: PlusCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  updated: { icon: Edit3, color: "text-amber-500", bg: "bg-amber-500/10" },
  completed: { icon: CheckCircle2, color: "text-verdant-primary", bg: "bg-verdant-primary/10" },
  deleted: { icon: Trash2, color: "text-red-500", bg: "bg-red-500/10" }
};

export function RecentActivity() {
  const { activity } = useDashboardStore();
  const recent = activity.slice(0, 10); // Display only last 10

  return (
    <div className="bg-surface-low rounded-[2.5rem] p-8 flex flex-col h-full shadow-lg shadow-black/5">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-surface-standard flex items-center justify-center shadow-inner">
          <Activity className="w-6 h-6 text-primary/40" />
        </div>
        <h2 className="text-2xl font-black font-display tracking-tight text-foreground">Sync History</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
        {recent.length > 0 ? (
          <div className="space-y-6">
            {recent.map((item, i) => {
              const ActionConfig = actionIcons[item.action] || actionIcons.updated;
              const title = item.changes?.title || "Operational cycle";
              
              let contextText = "";
              if (item.action === 'created') contextText = `Initialized: ${title}`;
              if (item.action === 'completed') contextText = `Synchronized: ${title}`;
              if (item.action === 'updated') contextText = `Refined: ${title}`;
              if (item.action === 'deleted') contextText = `Purged: ${title}`;

              return (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id}
                  className="group flex gap-6 items-start"
                >
                  <div className={`mt-1.5 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-surface-standard text-primary group-hover:bg-primary group-hover:text-surface-lowest transition-all duration-500 shadow-sm`}>
                    <ActionConfig.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col flex-1 bg-surface-standard/40 p-4 rounded-2xl group-hover:bg-surface-high transition-colors">
                    <span className="text-sm font-bold font-display text-foreground/80 group-hover:text-foreground transition-colors tracking-tight leading-tight">{contextText}</span>
                    <span className="text-[10px] text-foreground/20 font-black font-display uppercase tracking-widest mt-2 flex items-center gap-2">
                       {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                       <span className="w-1 h-1 rounded-full bg-foreground/10" />
                       Protocol {item.action}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center mb-6">
               <Activity className="w-8 h-8 text-primary/10" />
            </div>
            <p className="text-xl font-black font-display text-foreground/10 tracking-tighter uppercase italic">Awaiting history</p>
          </div>
        )}
      </div>
    </div>
  );
}
