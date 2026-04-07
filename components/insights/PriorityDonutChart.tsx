"use client";

import { useMemo, useState } from "react";
import { Task } from "@/types/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface PriorityDonutChartProps {
  tasks: Task[];
}

const COLORS: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#3b82f6',
  none: '#3f3f46' // outline color approx
};

export function PriorityDonutChart({ tasks }: PriorityDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const data = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0, none: 0 };
    tasks.forEach(t => {
      if (counts[t.priority] !== undefined) {
         counts[t.priority]++;
      } else {
         counts.none++; // fallback
      }
    });

    return [
      { name: "High", value: counts.high, key: "high" },
      { name: "Medium", value: counts.medium, key: "medium" },
      { name: "Low", value: counts.low, key: "low" },
      { name: "None", value: counts.none, key: "none" }
    ].filter(d => d.value > 0);
  }, [tasks]);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full bg-surface-low rounded-[2.5rem] p-8 sm:p-10 shadow-sm fade-in-up flex flex-col h-[500px] group hover:bg-surface-standard transition-all duration-500 overflow-hidden relative">
       <div className="flex items-center justify-between mb-2 z-10">
          <div>
            <h3 className="text-[10px] font-black font-display uppercase tracking-[0.2em] text-foreground/20">Distribution</h3>
            <p className="text-2xl font-black font-display tracking-tighter text-foreground mt-2 leading-none">Priority Mapping</p>
          </div>
       </div>
       <p className="text-[10px] font-black font-display uppercase tracking-widest text-primary/40 mt-4 mb-8 z-10">System Load: {total} nodes</p>

       <div className="flex-1 w-full relative min-h-[300px] flex items-center justify-center z-10">
          {data.length === 0 ? (
            <div className="text-[10px] font-black font-display uppercase tracking-widest text-foreground/20">Empty Data Set</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                  animationBegin={200}
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell 
                       key={`cell-${index}`} 
                       fill={COLORS[entry.key]} 
                       fillOpacity={activeIndex === undefined || activeIndex === index ? 1 : 0.2}
                       className="transition-all duration-500 outline-none"
                       style={{ filter: activeIndex === index ? 'drop-shadow(0 0 12px rgba(16,185,129,0.2))' : 'none' }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                        return (
                           <div className="bg-surface-highest rounded-2xl p-4 shadow-2xl border-none ring-1 ring-white/5 backdrop-blur-xl">
                              <p className="text-[10px] font-black font-display uppercase tracking-widest text-foreground/30 mb-2">{payload[0].payload.name}</p>
                              <p className="text-xl font-black font-display tracking-tighter flex items-center gap-3">
                                 <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: payload[0].payload.fill }} />
                                 <span className="text-foreground">{payload[0].value} <span className="text-foreground/30 text-sm font-black italic">instances</span></span>
                              </p>
                           </div>
                        );
                     }
                     return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {data.length > 0 && (
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-0">
                <span className="text-5xl font-black font-display tracking-tighter text-foreground leading-none">{total}</span>
                <span className="text-[10px] uppercase font-black font-display tracking-[0.2em] text-foreground/20 mt-4">Capacity</span>
             </div>
          )}
       </div>
    </div>
  );
}
