"use client";

import { useState, useRef } from "react";
import { format, subDays, isAfter } from "date-fns";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Task, TaskActivity, UserStats } from "@/types/dashboard";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Brain, Zap, ArrowRight, Loader2, ShieldAlert } from "lucide-react";

// Component imports
import { InsightsHeader } from "@/components/insights/InsightsHeader";
import { KPICards } from "@/components/insights/KPICards";
import { CompletionTrendChart } from "@/components/insights/CompletionTrendChart";
import { PriorityDonutChart } from "@/components/insights/PriorityDonutChart";
import { CategoryBarChart } from "@/components/insights/CategoryBarChart";

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
    const toastId = toast.loading("Synthesizing Diagnostic Report...");
    
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0a', 
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Prio_Neural_Insights_${format(new Date(), "yyyy-MM-dd")}.pdf`);
      
      toast.success("Intelligence Dossier Exported.", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Telemetry Export Failed", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  if (initialTasks.length === 0) {
     return (
       <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8 text-center select-none overflow-hidden relative">
          {/* Ambient Background Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-kinetic/5 rounded-full blur-[100px]" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="z-10 relative max-w-2xl px-6"
          >
            <div className="mb-16 flex justify-center">
               <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-[4rem] blur-2xl group-hover:bg-primary/40 transition-all duration-700 scale-110" />
                  <div className="w-40 h-40 rounded-[3.5rem] bg-surface/50 backdrop-blur-2xl border border-primary/20 flex items-center justify-center shadow-2xl relative overflow-hidden">
                     <motion.div 
                        animate={{ 
                           scale: [1, 1.05, 1],
                           rotate: [0, 5, -5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                     >
                        <Brain className="w-16 h-16 text-primary group-hover:text-primary transition-colors duration-500" />
                     </motion.div>
                     <div className="absolute bottom-4 flex gap-1">
                        {[0, 1, 2].map((i) => (
                           <motion.div 
                              key={i}
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                              className="w-1 h-1 rounded-full bg-primary"
                           />
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface-highest/50 border border-outline/10 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
                  <ShieldAlert className="w-3 h-3" />
                  Telemetry Void
               </div>
               
               <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground leading-[0.9] mb-8">
                  Neural engine <br /> 
                  <span className="text-primary italic">awaiting pulse.</span>
               </h2>
               
               <p className="text-lg text-foreground/40 font-medium max-w-lg mx-auto leading-relaxed mb-12">
                  The Prio analytical core is currently cold. Deploy initial operational tasks to seed the data-stream and initialize predictive diagnostic modeling.
               </p>

               <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/dashboard')}
                  className="group relative inline-flex items-center gap-4 bg-primary text-background px-12 py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 overflow-hidden"
               >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Initialize Stream</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
               </motion.button>
            </div>
          </motion.div>
       </div>
     )
  }

  return (
    <div className="flex flex-col gap-10 max-w-[1600px] mx-auto w-full pb-24 px-4 sm:px-6 lg:px-8 mt-10">
      <InsightsHeader 
        range={range} 
        onRangeChange={setRange} 
        onExport={handleExportPDF} 
        isExporting={isExporting} 
      />

      <div ref={dashboardRef} className="flex flex-col gap-10 p-2 relative rounded-[3rem] bg-background">
        {/* KPI Row */}
        <KPICards 
          tasks={filteredTasks} 
          stats={initialStats} 
          activity={filteredActivity} 
          range={range} 
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 flex flex-col h-full min-h-[500px]">
             <CompletionTrendChart tasks={filteredTasks} range={range} startDate={startDate} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-10 h-full min-h-[500px]">
             <PriorityDonutChart tasks={filteredTasks} />
             <CategoryBarChart tasks={filteredTasks} />
          </div>
        </div>
      </div>
      
      {/* Visual Footer Marker */}
      <div className="flex items-center justify-center opacity-20 hover:opacity-40 transition-opacity duration-1000 mt-20">
         <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary" />
         <Brain className="w-6 h-6 mx-6" />
         <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary" />
      </div>
    </div>
  );
}
