"use client";

import { Download, RefreshCw, Activity, Terminal } from "lucide-react";
import { DateRange } from "@/app/(dashboard)/insights/InsightsClient";
import { motion } from "framer-motion";

interface InsightsHeaderProps {
  range: DateRange;
  onRangeChange: (r: DateRange) => void;
  onExport: () => void;
  isExporting: boolean;
}

export function InsightsHeader({ range, onRangeChange, onExport, isExporting }: InsightsHeaderProps) {
  const ranges: { value: DateRange; label: string }[] = [
    { value: '7', label: "7 DAYS" },
    { value: '30', label: "30 DAYS" },
    { value: '90', label: "90 DAYS" },
    { value: 'all', label: "ALL TIME" },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-12 sm:mb-16">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 w-fit backdrop-blur-xl">
          <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Diagnostics Active</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-black font-space-grotesk tracking-tighter text-foreground leading-[0.85] uppercase">
          Neural<br/><span className="text-primary italic">Insights</span>
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <Terminal className="w-3 h-3 text-foreground/20" />
          <p className="text-foreground/30 font-black uppercase text-[10px] tracking-[0.4em]">Protocol: Operational Integrity v2.4.0</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
        <div className="flex items-center bg-surface/50 backdrop-blur-md border border-outline/10 rounded-[2rem] p-1.5 shadow-xl w-full sm:w-auto">
          {ranges.map(r => (
            <button
              key={r.value}
              onClick={() => onRangeChange(r.value)}
              className={`flex-1 sm:flex-none px-6 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-700 relative overflow-hidden group ${
                range === r.value 
                  ? 'text-background' 
                  : 'text-foreground/30 hover:text-foreground/60'
              }`}
            >
              {range === r.value && (
                <motion.div 
                  layoutId="activeRange"
                  className="absolute inset-0 bg-primary shadow-lg shadow-primary/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{r.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-surface-highest border border-outline/10 text-foreground hover:bg-kinetic hover:text-background hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 rounded-[2.25rem] text-[10px] font-black uppercase tracking-widest shadow-2xl group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />}
          <span>Report Extraction</span>
        </button>
      </div>
    </div>
  );
}
