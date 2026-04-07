"use client";

import { useMemo } from "react";
import { Task } from "@/types/dashboard";
import { DateRange } from "@/app/(dashboard)/insights/InsightsClient";
import { format, parseISO, eachDayOfInterval, isAfter, isSameDay, subDays } from "date-fns";
import { TrendingUp, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface CompletionTrendChartProps {
  tasks: Task[];
  range: DateRange;
  startDate: Date;
}

export function CompletionTrendChart({ tasks, range, startDate }: CompletionTrendChartProps) {
  const data = useMemo(() => {
    // Determine bounds
    const end = new Date();
    // Use an explicitly wider window if 'all' is selected
    const start = range === 'all' ? (tasks.length > 0 ? parseISO(tasks[tasks.length - 1].created_at) : subDays(end, 365)) : startDate;

    const days = eachDayOfInterval({ start, end });
    
    // Process completed tasks
    const completedTasks = tasks.filter(t => t.status === 'done' && t.completed_at);

    return days.map(day => {
       const count = completedTasks.filter(t => isSameDay(parseISO(t.completed_at!), day)).length;
       return {
         date: format(day, "MMM dd"),
         fullDate: format(day, "yyyy-MM-dd"),
         count
       }
    });

  }, [tasks, range, startDate]);

  return (
    <div className="w-full bg-surface/50 backdrop-blur-xl border border-outline/10 rounded-[3rem] p-10 shadow-2xl flex flex-col h-[550px] group relative overflow-hidden">
       <div className="flex items-center justify-between mb-10 z-10">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
                <Activity className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Operational Velocity</h3>
                <p className="text-[9px] font-medium text-foreground/30 uppercase tracking-widest mt-1">Temporal Resolution Analysis</p>
             </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-highest/50 border border-outline/10 text-[9px] font-black uppercase tracking-widest text-foreground/40">
             <TrendingUp className="w-3 h-3 text-primary" />
             Active Optimization
          </div>
       </div>

       <div className="flex-1 w-full relative z-10">
          {data.length === 0 ? (
             <div className="flex w-full h-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-foreground/20">
                Data Stream Offline
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="verdantGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--foreground)" strokeOpacity={0.05} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--foreground)', opacity: 0.2, fontSize: 10, fontWeight: 900, fontFamily: 'var(--font-space-grotesk)' }} 
                  dy={16} 
                  minTickGap={40}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--foreground)', opacity: 0.2, fontSize: 10, fontWeight: 900, fontFamily: 'var(--font-space-grotesk)' }} 
                  allowDecimals={false}
                  dx={-10}
                />
                <Tooltip 
                   cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }}
                   content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                         return (
                            <div className="bg-surface-standard/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-outline/10 scale-90 sm:scale-100">
                               <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">{payload[0].payload.fullDate}</p>
                               <p className="text-xl font-black tracking-tighter flex items-center gap-3">
                                  <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
                                  <span className="text-foreground">{payload[0].value} <span className="text-foreground/30 text-[10px] font-black uppercase tracking-widest ml-1">Cycles</span></span>
                               </p>
                            </div>
                         )
                      }
                      return null;
                   }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--primary)" 
                  strokeWidth={5}
                  fillOpacity={1} 
                  fill="url(#verdantGradient)" 
                  activeDot={{ r: 8, fill: 'var(--primary)', stroke: 'var(--background)', strokeWidth: 5 }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
       </div>
       
       <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/10 transition-all duration-1000" />
    </div>
  );
}
