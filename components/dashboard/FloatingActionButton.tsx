"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTaskModal } from "@/hooks/useTaskModal";

export function FloatingActionButton() {
  const { open } = useTaskModal();
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full verdant-gradient shadow-[0_0_30px_rgba(45,212,191,0.5)] flex items-center justify-center text-background border-2 border-surface group"
      onClick={() => {
        open();
      }}
    >
      <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      
      {/* Ripple background effect on hover */}
      <div className="absolute inset-0 rounded-full border-2 border-kinetic animate-ping opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDuration: '2s' }} />
    </motion.button>
  );
}
