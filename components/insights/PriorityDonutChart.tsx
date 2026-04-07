"use client";

import { useMemo, useState } from "react";
import { Task } from "@/types/dashboard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Target } from "lucide-react";

interface PriorityDonutChartProps {
  tasks: Task[];
}

const COLORS: Record<string, string> = {
  high: '#F43F5E', // Rose 500
  medium: '#FB7185', // Rose 400
  low: '#FDA4AF', // Rose 300
  none: '#3f3f46' 
};

export function PriorityDonutChart({ tasks }: PriorityDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const data = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0, none: 0 };
    tasks.forEach(t => {
      const p = t.priority as keyof typeof counts;
      if (counts[p] !== undefined) {
         counts[p]++;
      } else {
         counts.none++;
      }
    });

    return [
      { name: "CRITICAL", value: counts.high, key: "high" },
      { name: "ELEVATED", value: counts.medium, key: "medium" },
      { name: "STANDARD", value: counts.low, key: "low" },
      { name: "UNRANKED", value: counts.none, key: "none" }
    ].filter(d => d.value > 0);
  }, [tasks]);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full bg-surface/50 backdrop-blur-xl border border-outline/10 rounded-[3rem] p-10 shadow-2xl flex flex-col h-full min-h-[550px] group relative overflow-hidden">
       <div className="flex items-center justify-between mb-2 z-10">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
                <Target className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Priority Mapping</h3>
                <p className="text-[9px] font-medium text-foreground/30 uppercase tracking-widest mt-1">Hierarchical Distribution</p>
             </div>
          </div>
       </div>

       <div className="flex-1 w-full relative flex items-center justify-center z-10 mt-10">
          {data.length === 0 ? (
            <div className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Empty Data Set</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={10}
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
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                     if (active && payload && payload.length) {
                        return (
                           <div className="bg-surface-standard/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-outline/10 scale-90 sm:scale-100">
                              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">{payload[0].payload.name}</p>
                              <p className="text-xl font-black tracking-tighter flex items-center gap-3">
                                 <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: payload[0].payload.fill }} />
                                 <span className="text-foreground">{payload[0].value} <span className="text-foreground/30 text-[10px] font-black uppercase tracking-widest ml-1">Nodes</span></span>
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
                <span className="text-6xl font-black tracking-tighter text-foreground leading-none">{total}</span>
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-foreground/20 mt-4">Total Load</span>
             </div>
          )}
       </div>
       
       <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
    </div>
  );
}
