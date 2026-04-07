"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  KanbanSquare, 
  CalendarDays, 
  LineChart, 
  User,
  Circle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/kanban", label: "Board", icon: KanbanSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/insights", label: "Stats", icon: LineChart },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-2xl border-t border-outline/10 px-6 flex items-center justify-between z-50 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="relative flex flex-col items-center justify-center w-14 h-14 transition-colors"
          >
            {/* Active Highlight Glow */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-glow"
                  className="absolute inset-0 bg-verdant-primary/10 rounded-2xl -z-10 shadow-[0_0_20px_rgba(45,212,191,0.15)]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </AnimatePresence>

            <div className={`relative ${isActive ? "text-kinetic" : "text-foreground/40"}`}>
              <item.icon className="w-6 h-6 transition-transform duration-300" 
                style={{ 
                  transform: isActive ? "translateY(-2px)" : "none",
                  filter: isActive ? "drop-shadow(0 0 8px rgba(45, 212, 191, 0.4))" : "none"
                }} 
              />
              
              {/* Active Indicator Dot */}
              {isActive && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-kinetic rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]"
                />
              )}
            </div>

            <span className={`text-[10px] font-bold mt-1 transition-colors ${isActive ? "text-foreground" : "text-foreground/30"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

