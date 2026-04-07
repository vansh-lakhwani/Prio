import { ReactNode } from "react";
import { CheckCircle2, Layout, Zap, Shield } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Left Pane - Branding & Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-surface border-r border-outline flex-col">
        {/* Kinetic Gradients */}
        <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] rounded-full bg-verdant-primary/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[70%] h-[70%] rounded-full bg-kinetic/10 blur-[130px] pointer-events-none" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 p-12 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl verdant-gradient flex items-center justify-center kinetic-glow">
              <CheckCircle2 className="w-6 h-6 text-surface" />
            </div>
            <span className="text-2xl font-bold font-space-grotesk tracking-tight text-foreground">Prio</span>
          </div>

          <div className="max-w-md mt-auto mb-16">
            <h1 className="text-5xl font-space-grotesk font-black mb-6 leading-[1.1] tracking-tighter">
              Manage workflows with <span className="text-transparent bg-clip-text verdant-gradient">kinetic clarity.</span>
            </h1>
            <p className="text-lg text-foreground/70 font-manrope font-medium leading-relaxed">
              Join thousands of professionals organizing their life and work inside an ecosystem designed for focus.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="glass p-4 rounded-2xl border-outline/10 flex items-center justify-center">
              <Layout className="w-6 h-6 text-kinetic" />
            </div>
            <div className="glass p-4 rounded-2xl border-outline/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-kinetic" />
            </div>
            <div className="glass p-4 rounded-2xl border-outline/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-kinetic" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Standard Form Injection Area */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        {/* Mobile Logo Fallback */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl verdant-gradient flex items-center justify-center kinetic-glow">
            <CheckCircle2 className="w-6 h-6 text-surface" />
          </div>
          <span className="text-2xl font-bold font-space-grotesk tracking-tight text-foreground">Prio</span>
        </div>
        
        {children}
      </div>
    </div>
  );
}

