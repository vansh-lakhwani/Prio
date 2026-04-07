"use client";

import { useMemo } from "react";
import { Task } from "@/types/dashboard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

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
    <div className="w-full bg-surface-low rounded-[2.5rem] p-8 sm:p-10 shadow-sm fade-in-up flex flex-col h-[500px] group hover:bg-surface-standard transition-all duration-500 overflow-hidden relative">
       <div className="flex items-center justify-between mb-10 z-10">
          <div>
            <h3 className="text-[10px] font-black font-display uppercase tracking-[0.2em] text-foreground/20">Categorical Log</h3>
            <p className="text-2xl font-black font-display tracking-tighter text-foreground mt-2 leading-none">Classified Index</p>
          </div>
       </div>

       <div className="flex-1 w-full relative z-10">
          {data.length === 0 ? (
             <div className="flex w-full h-full items-center justify-center text-[10px] font-black font-display uppercase tracking-widest text-foreground/20">
               Null Data Set
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
                            <div className="bg-surface-highest rounded-2xl p-4 shadow-2xl border-none ring-1 ring-white/5 backdrop-blur-xl">
                               <p className="text-[10px] font-black font-display uppercase tracking-widest text-foreground/30 mb-2">{payload[0].payload.name}</p>
                               <p className="text-xl font-black font-display tracking-tighter flex items-center gap-3">
                                  <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg" />
                                  <span className="text-foreground">{val} <span className="text-foreground/30 text-sm font-black italic">segments</span></span>
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
    </div>
  );
}
