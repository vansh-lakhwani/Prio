"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "shimmer" | "pulse";
}

export function Skeleton({ className, variant = "shimmer" }: SkeletonProps) {
  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "animate-pulse rounded-md bg-foreground/5",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-foreground/5",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.1) 30%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="bg-surface p-4 rounded-2xl flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
}

