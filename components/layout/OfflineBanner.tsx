"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-red-500/90 backdrop-blur-md rounded-full border border-red-400/30 shadow-2xl flex items-center gap-3"
        >
          <WifiOff className="w-5 h-5 text-white animate-pulse" />
          <span className="text-white font-bold text-sm">Offline Mode • Using cached data</span>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-kinetic/90 backdrop-blur-md rounded-full border border-kinetic/30 shadow-2xl flex items-center gap-3"
        >
          <Wifi className="w-5 h-5 text-background" />
          <span className="text-background font-bold text-sm">Connection restored</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
