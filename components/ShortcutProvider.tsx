"use client";

import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { ReactNode } from "react";
import { useMounted } from "@/lib/hooks/useMounted";

export function ShortcutProvider({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  useKeyboardShortcuts();
  
  if (!mounted) return <>{children}</>;
  return <>{children}</>;
}
