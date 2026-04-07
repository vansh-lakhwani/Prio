"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait a few seconds before showing the prompt
      setTimeout(() => setIsVisible(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-[110] md:max-w-sm md:left-auto md:right-8"
        >
          <div className="glass border border-outline/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-kinetic/20 blur-3xl rounded-full" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-kinetic/10 border border-kinetic/30 flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-kinetic" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg font-space-grotesk tracking-tight">Install Prio</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">
                  Add Prio to your home screen for the best experience and offline access.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {isIOS ? (
                <div className="flex flex-col gap-2 p-3 bg-[#18221d]/5 border border-outline/10 rounded-2xl text-xs text-foreground/60">
                   <p className="flex items-center gap-2">
                     <Share className="w-4 h-4" /> 1. Tap the <strong>Share</strong> button
                   </p>
                   <p className="flex items-center gap-2">
                     <span className="w-4 h-4 border border-outline/10 rounded flex items-center justify-center font-bold text-[8px]">+</span> 2. Select <strong>Add to Home Screen</strong>
                   </p>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-4 bg-kinetic text-background font-bold rounded-2xl shadow-lg shadow-kinetic/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Install App
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



