"use client";

import { Download, RefreshCw } from "lucide-react";
import { DateRange } from "@/app/(dashboard)/insights/InsightsClient";

interface InsightsHeaderProps {
  range: DateRange;
  onRangeChange: (r: DateRange) => void;
  onExport: () => void;
  isExporting: boolean;
}

export function InsightsHeader({ range, onRangeChange, onExport, isExporting }: InsightsHeaderProps) {
  const ranges: { value: DateRange; label: string }[] = [
    { value: '7', label: "7D" },
    { value: '30', label: "30D" },
    { value: '90', label: "90D" },
    { value: 'all', label: "All" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 fade-in-up">
      <div>
        <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tighter text-foreground leading-none uppercase">Analysis</h1>
        <p className="text-foreground/30 font-display font-black uppercase text-[10px] tracking-[0.3em] mt-4">Protocol: Operational v2.4</p>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto hide-on-export">
        <div className="flex items-center bg-surface-low rounded-2xl p-1 shrink-0">
          {ranges.map(r => (
            <button
              key={r.value}
              onClick={() => onRangeChange(r.value)}
              className={`px-6 py-2.5 text-[10px] font-black font-display uppercase tracking-widest whitespace-nowrap rounded-xl transition-all duration-500 ${
                range === r.value 
                  ? 'bg-primary text-surface-lowest shadow-lg shadow-primary/20' 
                  : 'text-foreground/20 hover:text-foreground/40 hover:bg-surface-standard'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <button
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-500 rounded-2xl text-[10px] font-black font-display uppercase tracking-widest whitespace-nowrap disabled:opacity-50 group"
        >
          {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />}
          Export
        </button>
      </div>
    </div>
  );
}
