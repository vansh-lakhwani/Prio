"use client";

import { useState, useRef } from "react";
import { format, subDays, isAfter, isBefore, startOfDay } from "date-fns";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Task, TaskActivity, UserStats } from "@/types/dashboard";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Component imports
import { InsightsHeader } from "@/components/insights/InsightsHeader";
import { KPICards } from "@/components/insights/KPICards";
import { CompletionTrendChart } from "@/components/insights/CompletionTrendChart";
import { PriorityDonutChart } from "@/components/insights/PriorityDonutChart";
import { CategoryBarChart } from "@/components/insights/CategoryBarChart";
import { CompletionHeatmap } from "@/components/insights/CompletionHeatmap";
import { ProductivityInsights } from "@/components/insights/ProductivityInsights";
import { ActivityTimeline } from "@/components/insights/ActivityTimeline";

interface InsightsClientProps {
  initialTasks: Task[];
  initialStats: UserStats | null;
  initialActivity: TaskActivity[];
}

export type DateRange = '7' | '30' | '90' | 'all';

export function InsightsClient({ initialTasks, initialStats, initialActivity }: InsightsClientProps) {
  const router = useRouter();
  const [range, setRange] = useState<DateRange>('30');
  const [isExporting, setIsExporting] = useState(false);
  
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Filter Data Arrays by DateRange
  const getStartDate = () => {
    if (range === 'all') return new Date(0);
    return subDays(new Date(), parseInt(range));
  };
  
  const startDate = getStartDate();

  const filteredTasks = initialTasks.filter(t => t.created_at && isAfter(new Date(t.created_at), startDate));
  const filteredActivity = initialActivity.filter(a => a.created_at && isAfter(new Date(a.created_at), startDate));

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);
    const toastId = toast.loading("Generating Insights PDF...");
    
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0a', // specific verdant kinetic darkest shade
        ignoreElements: (element) => element.classList.contains('hide-on-export')
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Prio_Insights_${format(new Date(), "yyyy-MMM-dd")}.pdf`);
      
      toast.success("PDF Downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  if (initialTasks.length === 0) {
     return (
       <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-8 text-center select-none overflow-hidden relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10"
          >
            <div className="mb-12 flex justify-center">
               <div className="w-32 h-32 rounded-[3rem] bg-surface-low flex items-center justify-center shadow-inner group overflow-hidden relative">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <span className="text-6xl filter grayscale group-hover:grayscale-0 transition-all duration-700">🌱</span>
                  </motion.div>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>

            <h1 className="text-[10px] font-black font-display uppercase tracking-[0.4em] text-primary/40 mb-4">Incubation Phase</h1>
            <h2 className="text-4xl sm:text-6xl font-black font-display tracking-tighter text-foreground mb-8 leading-none italic">
              Data stream <br /> <span className="text-primary">initializing.</span>
            </h2>
            
            <p className="text-lg text-foreground/30 font-medium mb-12 max-w-sm mx-auto leading-relaxed">
               Your personalized productivity algorithms require established activity logs to generate behavioral architectures.
            </p>

            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-primary text-background hover:bg-primary/90 transition-all px-10 py-6 h-auto text-sm font-black font-display uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95]"
            >
              Seed Activity
            </button>
          </motion.div>
       </div>
     )
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full pb-20">
      <InsightsHeader 
        range={range} 
        onRangeChange={setRange} 
        onExport={handleExportPDF} 
        isExporting={isExporting} 
      />

      <div ref={dashboardRef} className="flex flex-col gap-6 p-1 relative rounded-2xl">
        {/* KPI Row */}
        <KPICards 
          tasks={filteredTasks} 
          stats={initialStats} 
          activity={filteredActivity} 
          range={range} 
        />

        {/* Charts Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col">
             <CompletionTrendChart tasks={initialTasks} range={range} startDate={startDate} />
          </div>
          <div className="flex flex-col">
             <PriorityDonutChart tasks={filteredTasks} />
          </div>
        </div>

        {/* Categories & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBarChart tasks={filteredTasks} />
          <CompletionHeatmap activity={initialActivity} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
             <ProductivityInsights tasks={filteredTasks} stats={initialStats} activity={filteredActivity} />
          </div>
          <div>
             <ActivityTimeline activity={filteredActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
