"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  KanbanSquare, 
  CalendarDays, 
  LineChart, 
  User, 
  CheckCircle2, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kanban", label: "Kanban", icon: KanbanSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/insights", label: "Insights", icon: LineChart },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="hidden md:flex h-screen flex-col bg-surface-low relative transition-all duration-300 ease-in-out z-40"
    >
      {/* Brand */}
      <div className={`p-8 flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-4'} mb-8`}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/10">
          <CheckCircle2 className="w-7 h-7 text-surface-lowest" />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="text-3xl font-bold font-display tracking-tight text-foreground"
          >
            Prio
          </motion.span>
        )}
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-8 h-8 rounded-full bg-surface-highest border border-outline-variant flex items-center justify-center text-foreground/50 hover:text-primary transition-all duration-300 z-50 shadow-md"
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="block relative focus:outline-none group">
              <div className={`
                flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-5'} py-4 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-primary-container/10 text-primary' : 'text-foreground/60 hover:bg-surface-highest hover:text-foreground'}
              `}>
                <item.icon className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                {!isCollapsed && <span className="font-bold font-sans tracking-tight">{item.label}</span>}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active" 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-r-full" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area (Profile) */}
      <div className="p-6 bg-surface-standard/30 flex flex-col gap-6">
        {/* Profile Card / Avatar */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4 py-3 bg-surface-highest rounded-2xl transition-all hover:bg-surface-bright shadow-sm relative group/profile'}`}>
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-primary-container flex-shrink-0 flex items-center justify-center text-surface-lowest font-bold capitalize">
            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold font-sans truncate text-foreground">{profile?.full_name || 'User'}</p>
              <p className="text-xs font-medium text-foreground/40 truncate w-full">{profile?.email || 'user@example.com'}</p>
            </div>
          )}
          
          {/* Quick Logout Button (Desktop) */}
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="p-2 text-foreground/20 hover:text-danger-standard hover:bg-danger-standard/10 rounded-xl transition-all duration-300"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapsed Logout Icon */}
        {isCollapsed && (
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center py-4 text-foreground/20 hover:text-danger-standard hover:bg-danger-standard/10 rounded-2xl transition-all duration-300"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
