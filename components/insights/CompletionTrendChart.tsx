"use client";

import { useMemo } from "react";
import { Task } from "@/types/dashboard";
import { DateRange } from "@/app/(dashboard)/insights/InsightsClient";
import { format, parseISO, eachDayOfInterval, isAfter, isSameDay, subDays } from "date-fns";
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
    <div className="w-full bg-surface-low rounded-[2.5rem] p-8 sm:p-10 shadow-sm fade-in-up flex flex-col h-[500px] group hover:bg-surface-standard transition-all duration-500 overflow-hidden relative">
       <div className="flex items-center justify-between mb-10 z-10">
          <div>
            <h3 className="text-[10px] font-black font-display uppercase tracking-[0.2em] text-foreground/20">Operational Trend</h3>
            <p className="text-2xl font-black font-display tracking-tighter text-foreground mt-2 leading-none">Velocity Analysis</p>
          </div>
       </div>

       <div className="flex-1 w-full relative min-h-[300px] z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="verdantGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff15" />
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
                          <div className="bg-surface-highest rounded-2xl p-4 shadow-2xl border-none ring-1 ring-white/5 backdrop-blur-xl">
                             <p className="text-[10px] font-black font-display uppercase tracking-widest text-foreground/30 mb-2">{payload[0].payload.fullDate}</p>
                             <p className="text-xl font-black font-display tracking-tighter flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-foreground">{payload[0].value} <span className="text-foreground/30 text-sm font-black italic">completed</span></span>
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
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#verdantGradient)" 
                activeDot={{ r: 8, fill: 'var(--primary)', stroke: 'var(--surface-highest)', strokeWidth: 4 }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
}
