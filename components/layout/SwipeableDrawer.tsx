"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutDashboard, KanbanSquare, CalendarDays, LineChart, User, LogOut, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface SwipeableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kanban", label: "Kanban Board", icon: KanbanSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/insights", label: "Productivity", icon: LineChart },
  { href: "/profile", label: "Profile", icon: User },
];

export function SwipeableDrawer({ isOpen, onClose }: SwipeableDrawerProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-md z-[60] md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-surface/90 backdrop-blur-2xl border-r border-outline/10 z-[70] md:hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-outline/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl verdant-gradient flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-surface" />
                </div>
                <span className="text-2xl font-bold font-space-grotesk tracking-tight">Prio</span>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full glass border border-outline flex items-center justify-center text-foreground/50 hover:text-foreground active:scale-95 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={onClose}
                    className="block relative"
                  >
                    <div className={`
                      flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
                      ${isActive ? 'bg-verdant-primary/10 text-kinetic' : 'text-foreground/60 active:bg-[#18221d]/5'}
                    `}>
                      <item.icon className="w-6 h-6 flex-shrink-0" />
                      <span className="font-bold text-lg">{item.label}</span>
                      {isActive && (
                        <motion.div 
                          layoutId="drawer-active" 
                          className="absolute right-4 w-2 h-2 bg-kinetic rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" 
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer / Profile */}
            <div className="p-8 border-t border-outline/10 bg-[#18221d]/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-kinetic to-verdant-primary flex items-center justify-center text-background text-xl font-bold capitalize shadow-xl shadow-kinetic/20 ring-4 ring-outline/10">
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-lg font-bold">{profile?.full_name || 'User'}</p>
                  <p className="text-sm text-foreground/40">{profile?.email || 'user@example.com'}</p>
                </div>
              </div>

              <button 
                onClick={() => { signOut(); onClose(); }}
                className="w-full py-4 px-6 rounded-2xl border border-outline/10 bg-surface/50 text-foreground/80 font-bold flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-kinetic/[0.05] hover:text-kinetic hover:border-kinetic/50"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



