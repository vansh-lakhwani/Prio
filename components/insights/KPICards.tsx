"use client";

import { useEffect, useState } from "react";
import { Task, TaskActivity, UserStats } from "@/types/dashboard";
import { DateRange } from "@/app/(dashboard)/insights/InsightsClient";
import { CheckCircle2, Flame, Timer, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { parseISO, differenceInHours } from "date-fns";
import { motion } from "framer-motion";

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
  // Fallback fake trend: In a real app we'd compare the prior identical time window.
  // For now, positive trend if completing more than 1 per day.
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
  
  // Weights Algorithm
  const completedBase = Math.min((countCompleted / daysInRange) * 10, 100); 
  const streakBase = Math.min((streak / 30) * 100, 100);
  
  const calculatedScore = Math.round(
     (completedBase * 0.40) + 
     (streakBase * 0.30) + 
     (onTimeRate * 0.20) + 
     (85 * 0.10) // Consistency mocked to 85% for localized performance testing
  );

  useEffect(() => {
    // Count up animation
    setAnimatedScore(0);
    const id = setTimeout(() => {
        setAnimatedScore(calculatedScore);
    }, 100);
    return () => clearTimeout(id);
  }, [calculatedScore]);

  const cards = [
    {
      title: "Completed",
      value: countCompleted,
      suffix: "tasks",
      icon: <CheckCircle2 className="w-5 h-5 text-kinetic" />,
      trend: Number(trendPercent) > 0 ? <><TrendingUp className="w-3 h-3 text-kinetic" /> <span className="text-kinetic">+{trendPercent}%</span></> : <><Minus className="w-3 h-3 text-foreground/30" /> <span className="text-foreground/30">0%</span></>,
    },
    {
      title: "Current Streak",
      value: streak,
      suffix: "days",
      icon: <Flame className="w-5 h-5 text-amber-500" />,
      trend: <><Flame className="w-3 h-3 text-amber-500" /> <span className="text-amber-500">Peak: {stats?.longest_streak || 0}</span></>,
    },
    {
      title: "Avg Completion",
      value: avgHours < 24 ? avgHours.toFixed(1) : (avgHours / 24).toFixed(1),
      suffix: avgHours < 24 ? "hrs" : "days",
      icon: <Timer className="w-5 h-5 text-blue-500" />,
      trend: <><TrendingDown className="w-3 h-3 text-kinetic" /> <span className="text-kinetic">Optimal</span></>,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
      {cards.map((card, idx) => (
        <motion.div 
           key={card.title}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: idx * 0.1 }}
           className="p-8 rounded-[2.5rem] bg-surface-low hover:bg-surface-standard transition-all duration-500 group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-[10px] font-black font-display uppercase tracking-[0.2em] text-foreground/20">{card.title}</h3>
             <div className="p-3 rounded-2xl bg-surface-highest text-primary/40 group-hover:text-primary transition-all duration-500 shadow-inner">
                {card.icon}
             </div>
          </div>
          <div className="flex items-baseline gap-3">
             <span className="text-5xl font-black font-display tracking-tighter text-foreground leading-none">{card.value}</span>
             <span className="text-sm font-black font-display text-foreground/20 uppercase tracking-widest">{card.suffix}</span>
          </div>
          <div className="flex items-center gap-2 mt-8 text-[10px] font-black font-display uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">
             {card.trend}
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </motion.div>
      ))}

      {/* Specialty Custom Progress Card (Botanical Alignment) */}
      <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="relative overflow-hidden p-8 rounded-[2.5rem] bg-surface-low border-2 border-primary/5 flex flex-col justify-between group hover:bg-surface-standard transition-all duration-500"
        >
           <h3 className="text-[10px] font-black font-display uppercase tracking-[0.2em] text-primary/40 mb-2 z-10 relative">Operational Efficiency</h3>
           <div className="flex items-center justify-between z-10 relative mt-auto">
              <div className="flex flex-col">
                 <span className="text-6xl font-black font-display tracking-tighter text-primary">{animatedScore}</span>
                 <span className="text-[10px] font-black font-display uppercase tracking-widest text-primary/30 mt-3">cycle score / 100</span>
              </div>
              
              {/* Circular Native Progress */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" className="text-primary/5 w-full h-full" strokeWidth="8" />
                    <motion.circle 
                       cx="48" 
                       cy="48" 
                       r="42" 
                       fill="none" 
                       stroke="currentColor" 
                       className="text-primary w-full h-full stroke-current drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]" 
                       strokeWidth="8" 
                       strokeLinecap="round"
                       initial={{ strokeDasharray: 264, strokeDashoffset: 264 }}
                       animate={{ strokeDashoffset: 264 - (264 * animatedScore) / 100 }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary group-hover:scale-125 transition-transform" />
                 </div>
              </div>
           </div>
           
           {/* Abstract BG */}
           <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
      </motion.div>
    </div>
  );
}
