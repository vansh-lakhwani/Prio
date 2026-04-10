"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Bell, Search, Menu, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
export function TopBar() {
  const { profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-24 w-full glass px-8 flex items-center justify-between z-30 sticky top-0">
        
        {/* Mobile Left (Hamburger + Brand) */}
        <div className="flex items-center gap-6 md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 -ml-3 text-foreground/30 hover:text-primary transition-colors bg-surface-low rounded-2xl"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 rounded-xl relative flex items-center justify-center overflow-hidden shadow-ambient">
            <Image src="/icon.png" alt="Prio Logo" fill className="object-cover" />
          </div>
        </div>

        {/* Global Search (Tactical Command) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              id="global-search"
              type="text"
              placeholder="Command search / Shift + K"
              className="block w-full pl-14 pr-16 py-4 bg-surface-low rounded-[2rem] font-sans font-medium placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-standard sm:text-sm transition-all shadow-inner shadow-black/5"
            />
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black font-display uppercase tracking-widest text-foreground/20 bg-surface-highest">
                <abbr title="Command" className="no-underline">âŒ˜</abbr> K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-6 ml-auto">
          <button className="relative w-12 h-12 rounded-2xl bg-surface-low flex items-center justify-center text-foreground/30 hover:text-primary transition-all hover:scale-105 shadow-sm">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-surface-low animate-pulse" />
          </button>
          
          <div className="md:hidden w-12 h-12 rounded-[1.2rem] bg-surface-highest flex items-center justify-center text-foreground/60 font-black font-display text-sm shadow-md">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="w-4/5 max-w-sm h-full bg-surface border-r border-outline relative flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-outline/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl relative flex items-center justify-center overflow-hidden">
                  <Image src="/icon.png" alt="Prio Logo" fill className="object-cover" />
                </div>
                <span className="text-2xl font-black font-display tracking-tight text-foreground">Prio</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-foreground/50 hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Mobile Nav Links Container */}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 bg-primary/10 text-primary font-bold rounded-xl">Dashboard</Link>
              <Link href="/kanban" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-foreground/70 font-semibold rounded-xl hover:bg-primary/5">Kanban</Link>
              <Link href="/calendar" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-foreground/70 font-semibold rounded-xl hover:bg-primary/5">Calendar</Link>
              <Link href="/insights" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-foreground/70 font-semibold rounded-xl hover:bg-primary/5">Insights</Link>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-foreground/70 font-semibold rounded-xl hover:bg-primary/5">Profile</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



