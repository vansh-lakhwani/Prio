"use client";

import { useEffect, useState } from "react";
import { Task, TaskActivity, UserStats } from "@/types/dashboard";
import { DateRange } from "@/app/(dashboard)/insights/InsightsClient";
import { CheckCircle2, Flame, Timer, TrendingUp, TrendingDown, Minus, Zap, Target, BarChart3, Activity } from "lucide-react";
import { parseISO, differenceInHours } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface KPICardsProps {
  tasks: Task[];
  stats: UserStats | null;
  activity: TaskActivity[];
  range: DateRange;
}

export function KPICards({ tasks, stats, activity, range }: KPICardsProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // 1. Total Completed & Trend
  const completedTasks = tasks.filter(t => t.status === 'done');
  const countCompleted = completedTasks.length;
  const daysInRange = range === 'all' ? 365 : parseInt(range);
  const trendPercent = countCompleted > 0 ? ((countCompleted / daysInRange) * 10).toFixed(0) : 0;
  
  // 2. Avg Completion Time
  let avgHours = 0;
  if (completedTasks.length > 0) {
     const times = completedTasks.map(t => {
        if (!t.completed_at) return 0;
        return differenceInHours(parseISO(t.completed_at), parseISO(t.created_at));
     });
     avgHours = times.reduce((a,b) => a+b, 0) / times.length;
  }

  // 3. Productivity Score Algorithm
  const streak = stats?.current_streak || 0;
  const onTimeTasks = completedTasks.filter(t => t.due_date && t.completed_at && parseISO(t.completed_at) <= parseISO(t.due_date));
  const onTimeRate = completedTasks.length > 0 ? (onTimeTasks.length / completedTasks.length) * 100 : 0;
  
  const completedBase = Math.min((countCompleted / daysInRange) * 10, 100); 
  const streakBase = Math.min((streak / 30) * 100, 100);
  
  const calculatedScore = Math.round(
     (completedBase * 0.40) + 
     (streakBase * 0.30) + 
     (onTimeRate * 0.20) + 
     (85 * 0.10) 
  );

  useEffect(() => {
    setAnimatedScore(0);
    const id = setTimeout(() => {
        setAnimatedScore(calculatedScore);
    }, 100);
    return () => clearTimeout(id);
  }, [calculatedScore]);

  const cards = [
    {
      title: "Velocity Pulse",
      label: "Task Throughput",
      value: countCompleted,
      suffix: "tasks",
      icon: <Activity className="w-5 h-5 text-primary" />,
      color: "primary",
      trend: Number(trendPercent) > 0 ? <span className="text-primary">+{trendPercent}% Momentum</span> : <span className="text-foreground/20">Stagnant</span>,
    },
    {
      title: "Momentum Streak",
      label: "Cycle Consistency",
      value: streak,
      suffix: "days",
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      color: "orange",
      trend: <span className="text-orange-400/60 uppercase tracking-widest text-[9px] font-black">Peak: {stats?.longest_streak || 0}</span>,
    },
    {
      title: "Focus Density",
      label: "Resolution Speed",
      value: avgHours < 24 ? avgHours.toFixed(1) : (avgHours / 24).toFixed(1),
      suffix: avgHours < 24 ? "hrs" : "days",
      icon: <Timer className="w-5 h-5 text-primary" />,
      color: "primary",
      trend: <span className="text-primary/60 uppercase tracking-widest text-[9px] font-black">High Efficiency</span>,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12 sm:mt-16">
      {/* Execution Index - Hero Card */}
      <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative overflow-hidden p-10 rounded-[3rem] bg-surface/50 backdrop-blur-xl border border-primary/20 flex flex-col justify-between group shadow-2xl lg:col-span-1"
        >
           <div className="absolute top-0 right-0 p-8">
              <Zap className="w-6 h-6 text-primary animate-pulse" />
           </div>
           
           <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-2">Execution Index</h3>
              <p className="text-[11px] font-medium text-foreground/30 uppercase tracking-widest">Aggregate Score</p>
           </div>
           
           <div className="flex items-center justify-between mt-12 relative z-10">
              <div className="flex flex-col">
                 <span className="text-7xl font-black tracking-tighter text-foreground leading-none">{animatedScore}<span className="text-2xl text-primary/40 font-medium">%</span></span>
                 <div className="flex items-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Optimum Level</span>
                 </div>
              </div>
           </div>

           <div className="mt-10 h-1.5 w-full bg-primary/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${animatedScore}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
              />
           </div>
           
           {/* Abstract BG */}
           <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
      </motion.div>

      {cards.map((card, idx) => (
        <motion.div 
           key={card.title}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 * (idx + 1) }}
           className="p-10 rounded-[3rem] bg-surface/30 backdrop-blur-md border border-outline/10 hover:border-outline/30 transition-all duration-700 group relative overflow-hidden shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
             <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 group-hover:text-foreground/60 transition-colors">{card.title}</h3>
                <p className="text-[9px] font-medium text-foreground/20 uppercase tracking-widest mt-1">{card.label}</p>
             </div>
             <div className="p-4 rounded-2xl bg-surface-highest/50 text-foreground/20 group-hover:bg-surface-highest transition-all duration-500 shadow-inner">
                {card.icon}
             </div>
          </div>
          
          <div className="flex items-baseline gap-3">
             <span className="text-5xl font-black tracking-tighter text-foreground leading-none">{card.value}</span>
             <span className="text-xs font-black text-foreground/20 uppercase tracking-[0.2em]">{card.suffix}</span>
          </div>

          <div className="mt-10 flex items-center gap-3">
             <div className="h-[1px] flex-1 bg-outline/10 group-hover:bg-outline/20 transition-colors" />
             <div className="text-[9px] font-black uppercase tracking-widest transition-colors">
                {card.trend}
             </div>
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </motion.div>
      ))}
    </div>
  );
}
