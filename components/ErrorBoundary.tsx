"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: any): State {
    // Don't catch Next.js internal redirect or notFound errors
    if (
      error?.digest?.startsWith("NEXT_REDIRECT") || 
      error?.digest === "NEXT_NOT_FOUND" ||
      error?.message === "NEXT_REDIRECT"
    ) {
      // Re-throw to let Next.js handle it
      throw error;
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: any, errorInfo: ErrorInfo) {
    // Log non-Next.js errors
    if (
      !error?.digest?.startsWith("NEXT_REDIRECT") && 
      error?.digest !== "NEXT_NOT_FOUND"
    ) {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 max-w-2xl w-full"
          >
            <div className="mb-8 flex justify-center">
               <div className="w-24 h-24 rounded-[2rem] bg-surface-low flex items-center justify-center shadow-inner group overflow-hidden relative">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <AlertCircle className="w-10 h-10 text-primary" />
                  </motion.div>
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>

            <h1 className="text-[10px] font-black font-display uppercase tracking-[0.4em] text-primary/40 mb-4">System Interruption</h1>
            <h2 className="text-5xl sm:text-7xl font-black font-display tracking-tighter text-foreground mb-8 leading-none italic">
              Unexpected <br /> <span className="text-primary">Divergence.</span>
            </h2>
            
            <p className="text-lg text-foreground/40 font-medium mb-12 max-w-md mx-auto leading-relaxed">
               The architectural integrity has been compromised by an unforeseen exception. We recommend a system recalibration.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={this.handleReset}
                className="bg-primary text-background hover:bg-primary/90 transition-all px-8 py-6 h-auto text-sm font-black font-display uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 w-full sm:w-auto shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset System
              </button>
              <Link href="/" className="w-full sm:w-auto">
                <button 
                  className="bg-transparent border border-primary/20 text-primary hover:bg-primary/5 transition-all px-8 py-6 h-auto text-sm font-black font-display uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 w-full sm:w-auto hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Home className="w-4 h-4" />
                  Return Base
                </button>
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-16 p-6 bg-surface-low rounded-3xl text-left overflow-auto max-h-48 border border-white/5 backdrop-blur-sm">
                <p className="text-[10px] font-black font-display uppercase tracking-widest text-foreground/30 mb-2 font-mono">TraceLog</p>
                <code className="text-xs text-primary/60 font-mono break-all leading-relaxed">
                  {this.state.error.message}
                </code>
              </div>
            )}
          </motion.div>

          {/* Abstract Footer Text */}
          <div className="absolute bottom-12 left-12 transform -rotate-90 origin-left hidden lg:block">
             <span className="text-[8px] font-black font-display uppercase tracking-[1em] text-foreground/5 whitespace-nowrap">
               Error Protocol 0x8842 // Botanical Architect
             </span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
