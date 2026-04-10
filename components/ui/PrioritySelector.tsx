"use client";

import { TaskPriority } from "@/types/dashboard";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PrioritySelectorProps {
  value: TaskPriority;
  onChange: (value: TaskPriority) => void;
}

const priorities: { id: TaskPriority; label: string; color: string; bg: string }[] = [
  { id: "high", label: "High", color: "bg-accent-warning", bg: "hover:bg-accent-warning/10 data-[selected=true]:bg-accent-warning data-[selected=true]:text-surface-lowest" },
  { id: "medium", label: "Medium", color: "bg-accent-earth", bg: "hover:bg-accent-earth/10 data-[selected=true]:bg-accent-earth data-[selected=true]:text-surface-lowest" },
  { id: "low", label: "Low", color: "bg-primary/20", bg: "hover:bg-primary/10 data-[selected=true]:bg-primary data-[selected=true]:text-surface-lowest" },
  { id: "none", label: "None", color: "bg-surface-highest", bg: "hover:bg-surface-highest/50 data-[selected=true]:bg-surface-highest data-[selected=true]:text-foreground/60" },
];

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {priorities.map((p) => (
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          key={p.id}
          type="button"
          data-selected={value === p.id}
          onClick={() => onChange(p.id)}
          className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all font-display font-black text-[10px] uppercase tracking-widest bg-surface-low ${p.bg}`}
        >
          <div className="relative flex items-center justify-center">
            <motion.div 
               animate={{ scale: value === p.id ? 1.2 : 1 }}
               className={`w-2.5 h-2.5 rounded-full ${p.color} ${value === p.id && (p.id === 'high') ? 'ring-2 ring-surface-lowest' : ''}`} 
            />
          </div>
          <span>{p.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
