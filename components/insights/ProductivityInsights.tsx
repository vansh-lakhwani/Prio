"use client";

import { useMemo } from "react";
import { Task, TaskActivity, UserStats } from "@/types/dashboard";
import { Clock, Trophy, Flame, BarChart2 } from "lucide-react";
import { parseISO, getHours } from "date-fns";

interface ProductivityInsightsProps {
  tasks: Task[];
  stats: UserStats | null;
  activity: TaskActivity[];
}

export function ProductivityInsights({ tasks, stats, activity }: ProductivityInsightsProps) {
  
  const insights = useMemo(() => {
     // 1. Most Productive Time
     const completedActivity = activity.filter(a => a.action === 'completed');
     let peakHours = "N/A";
     if (completedActivity.length > 0) {
        const hourCounts: Record<number, number> = {};
        completedActivity.forEach(a => {
           const hr = getHours(parseISO(a.created_at));
           hourCounts[hr] = (hourCounts[hr] || 0) + 1;
        });
        const peak = parseInt(Object.keys(hourCounts).reduce((a, b) => hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b));
        peakHours = `${peak > 12 ? peak - 12 : (peak === 0 ? 12 : peak)} ${peak >= 12 ? 'PM' : 'AM'} - ${peak + 1 > 12 ? (peak + 1) - 12 : (peak + 1 === 0 ? 12 : peak + 1)} ${peak + 1 >= 12 ? 'PM' : 'AM'}`;
     }
     
     // 2. Top Category
     let topCategory = "None";
     let topCategoryCount = 0;
     const completedTasks = tasks.filter(t => t.status === 'done');
     if (completedTasks.length > 0) {
        const catCounts: Record<string, number> = {};
        completedTasks.forEach(t => {
           const cat = t.category_id || "Uncategorized";
           catCounts[cat] = (catCounts[cat] || 0) + 1;
        });
        topCategory = Object.keys(catCounts).reduce((a, b) => catCounts[a] > catCounts[b] ? a : b);
        topCategoryCount = catCounts[topCategory];
     }
     
     // 3. Longest Streak
     const longestStreak = stats?.longest_streak || 0;
     
     // 4. Avg Tasks Per Day (based on unique completion days)
     let avgPerDay = 0;
     if (completedTasks.length > 0) {
        const days = new Set(completedTasks.map(t => parseISO(t.completed_at!).toDateString())).size;
        avgPerDay = completedTasks.length / (days || 1);
     }

     return [
        {
           id: 'time',
           title: "Most Productive Time",
           value: peakHours,
           subtext: "Based on task completion timestamps",
           icon: <Clock className="w-5 h-5 text-blue-500" />,
           color: "bg-blue-500/10 border-blue-500/20"
        },
        {
           id: 'cat',
           title: "Top Category",
           value: topCategory,
           subtext: topCategoryCount > 0 ? `${topCategoryCount} completed tasks` : "No activity yet",
           icon: <Trophy className="w-5 h-5 text-amber-500" />,
           color: "bg-amber-500/10 border-amber-500/20"
        },
        {
           id: 'streak',
           title: "Longest Streak",
           value: `${longestStreak} Days`,
           subtext: "Your best uninterrupted run",
           icon: <Flame className="w-5 h-5 text-red-500" />,
           color: "bg-red-500/10 border-red-500/20"
        },
        {
           id: 'avg',
           title: "Avg Tasks Per Day",
           value: avgPerDay.toFixed(1),
           subtext: "Across active working days",
           icon: <BarChart2 className="w-5 h-5 text-kinetic" />,
           color: "bg-kinetic/10 border-kinetic/20"
        }
     ];

  }, [tasks, stats, activity]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
      {insights.map(i => (
         <div key={i.id} className={`p-5 rounded-3xl border flex flex-col justify-between transition-all hover:scale-[1.02] shadow-sm ${i.color} fade-in-up`}>
            <div className="p-2.5 rounded-full bg-surface/50 w-max mb-4 shadow-sm backdrop-blur-md">
               {i.icon}
            </div>
            <div>
               <h4 className="text-xl font-bold font-space-grotesk tracking-tight text-foreground mb-1">{i.value}</h4>
               <p className="text-xs uppercase tracking-widest font-bold text-foreground/60 mb-2">{i.title}</p>
               <p className="text-sm font-medium text-foreground/40">{i.subtext}</p>
            </div>
         </div>
      ))}
    </div>
  );
}
