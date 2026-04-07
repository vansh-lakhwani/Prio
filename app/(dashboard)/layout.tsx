"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { SwipeableDrawer } from "@/components/layout/SwipeableDrawer";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { InstallPrompt } from "@/components/layout/InstallPrompt";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Desktop TopBar */}
        <div className="hidden md:block">
          <TopBar />
        </div>

        {/* Mobile Header */}
        <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />

        {/* Mobile Swipeable Drawer */}
        <SwipeableDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-32 md:pt-8 md:pb-8 px-4 sm:px-6 md:px-10 lg:px-12">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />

        {/* PWA Enhancements */}
        <OfflineBanner />
        <InstallPrompt />
      </div>
    </div>
  );
}
