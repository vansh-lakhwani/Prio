"use client";

import { 
  Bell, 
  Search, 
  Menu,
  ChevronLeft,
  CheckCircle2
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

interface MobileHeaderProps {
  onMenuClick?: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (!last || last === 'dashboard') return 'Dashboard';
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  const showBackButton = pathname.split('/').filter(Boolean).length > 2;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden sticky top-0 left-0 right-0 h-16 bg-background/50 backdrop-blur-xl border-b border-outline/10 px-6 flex items-center justify-between z-40 safe-area-top"
    >
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl glass border border-outline flex items-center justify-center text-foreground hover:bg-[#18221d]/5 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-lg verdant-gradient flex items-center justify-center shadow-lg shadow-kinetic/20">
            <CheckCircle2 className="w-5 h-5 text-surface" />
          </div>
        )}
        
        <h1 className="text-xl font-bold font-space-grotesk tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/50 hover:text-foreground active:scale-90 transition-all">
          <Search className="w-5 h-5" />
        </button>
        
        <button className="w-10 h-10 rounded-xl relative flex items-center justify-center text-foreground/50 hover:text-foreground active:scale-90 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-kinetic rounded-full ring-2 ring-background ring-offset-0" />
        </button>

        <button 
          onClick={onMenuClick}
          className="w-10 h-10 border border-outline rounded-xl flex items-center justify-center text-foreground/50 hover:text-foreground hove:bg-[#18221d]/5 active:scale-90 transition-all ml-1"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </motion.header>
  );
}



