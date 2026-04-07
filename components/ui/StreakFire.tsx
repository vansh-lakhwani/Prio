"use client";

import { motion } from "framer-motion";

export function StreakFire({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="initial"
        animate="animate"
      >
        {/* Glow Layer */}
        <motion.path
          d="M12 2C12 2 7 6.5 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 6.5 12 2 12 2Z"
          fill="url(#fireGradient)"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: "blur(4px)" }}
        />

        {/* Main Flame */}
        <motion.path
          d="M12 2C12 2 7 6.5 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 6.5 12 2 12 2Z"
          fill="url(#fireGradient)"
          animate={{
            d: [
              "M12 2C12 2 7 6.5 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 6.5 12 2 12 2Z",
              "M12 3C12 3 8 7 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 7 12 3 12 3Z",
              "M12 2C12 2 7 6.5 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 6.5 12 2 12 2Z"
            ],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Moving Sparks */}
        <motion.circle
          cx="12"
          cy="12"
          r="1"
          fill="#F59E0B"
          animate={{
            y: [0, -10],
            x: [0, 2, -2],
            opacity: [1, 0],
            scale: [1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.2,
          }}
        />
        <motion.circle
          cx="10"
          cy="14"
          r="0.8"
          fill="#EF4444"
          animate={{
            y: [0, -8],
            x: [0, -3, 1],
            opacity: [1, 0],
            scale: [1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: 0.5,
          }}
        />

        <defs>
          <linearGradient id="fireGradient" x1="12" y1="2" x2="12" y2="17" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </motion.svg>
      {count > 1 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-background border border-orange-500/30 text-orange-500 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
        >
          {count}
        </motion.span>
      )}
    </div>
  );
}
