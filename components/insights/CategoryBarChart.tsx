"use client";

import { useMemo } from "react";
import { Task } from "@/types/dashboard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { Layers, Zap } from "lucide-react";

interface CategoryBarChartProps {
  tasks: Task[];
}

export function CategoryBarChart({ tasks }: CategoryBarChartProps) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    
    tasks.forEach(t => {
      const category = t.category_id || "Uncategorized";
      if (!counts[category]) counts[category] = 0;
      counts[category]++;
    });

    const entries = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Max 10. Collapse rest into "Other"
    if (entries.length > 10) {
       const top10 = entries.slice(0, 9);
       const rest = entries.slice(9).reduce((sum, item) => sum + item.value, 0);
       return [...top10, { name: "Other", value: rest }];
    }
    
    return entries;
  }, [tasks]);

  return (
    <div className="w-full bg-surface/50 backdrop-blur-xl border border-outline/10 rounded-[3rem] p-10 shadow-2xl flex flex-col h-[550px] group relative overflow-hidden">
       <div className="flex items-center justify-between mb-10 z-10">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
                <Layers className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Categorical Index</h3>
                <p className="text-[9px] font-medium text-foreground/30 uppercase tracking-widest mt-1">Domain Distribution</p>
             </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-highest/50 border border-outline/10 text-[9px] font-black uppercase tracking-widest text-foreground/40">
             <Zap className="w-3 h-3 text-primary" />
             Active Pulse
          </div>
       </div>

       <div className="flex-1 w-full relative z-10">
          {data.length === 0 ? (
             <div className="flex w-full h-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-foreground/20">
                Data Stream Offline
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" horizontal={false} vertical={true} stroke="var(--foreground)" strokeOpacity={0.05} />
                <XAxis 
                   type="number" 
                   hide 
                   allowDecimals={false} 
                />
                <YAxis 
                   type="category" 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: 'var(--foreground)', opacity: 0.3, fontSize: 10, fontWeight: 900, fontFamily: 'var(--font-space-grotesk)' }} 
                   width={120}
                />
                <Tooltip 
                   cursor={{ fill: 'var(--primary)', opacity: 0.05, radius: 12 }}
                   content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                         const val = payload[0].value;
                         return (
                            <div className="bg-surface-standard/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-outline/10 scale-90 sm:scale-100">
                               <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">{payload[0].payload.name}</p>
                               <p className="text-xl font-black tracking-tighter flex items-center gap-3">
                                  <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg" />
                                  <span className="text-foreground">{val} <span className="text-foreground/30 text-[10px] font-black uppercase tracking-widest ml-1">Nodes</span></span>
                               </p>
                            </div>
                         )
                      }
                      return null;
                   }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 12, 12, 0]} 
                  barSize={24}
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Other' ? 'var(--surface-highest)' : 'var(--primary)'} fillOpacity={0.8} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
       </div>
       
       <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
    </div>
  );
}
