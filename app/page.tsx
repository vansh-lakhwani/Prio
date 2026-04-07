"use client";

import { motion, useScroll, useTransform, animate, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Shield, Layout, Play, BarChart3, Activity, ListChecks, Users, Layers, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// --- Custom Counter Component ---
function Counter({ from, to, duration = 2, suffix = "" }: { from: number, to: number, duration?: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            // formatting to handle thousands (e.g. 10 instead of 10000, suffix handles "K")
            ref.current.textContent = Math.floor(value).toString() + suffix;
          }
        }
      });
      return () => controls.stop();
    }
  }, [inView, from, to, duration, suffix]);

  return <span ref={ref}>{from}{suffix}</span>;
}

// --- Typing Effect Component ---
function TypewriterText({ text, className }: { text: string, className?: string }) {
  const words = text.split(" ");
  return (
    <div className={`flex flex-wrap justify-center gap-[0.2em] ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const demoY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden font-sans text-foreground">
      
      {/* --- FLOATING MESH BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-verdant-primary/10 blur-[130px]" 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-kinetic/10 blur-[130px]" 
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full glass border-b border-outline/10 z-50 transition-all">
        <div className="flex items-center justify-between p-4 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl verdant-gradient flex items-center justify-center kinetic-glow">
              <CheckCircle2 className="w-5 h-5 text-surface" />
            </div>
            <span className="text-xl font-bold font-space-grotesk tracking-tight">Prio</span>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center gap-8">
            <Link href="#features" className="text-sm font-medium text-foreground/70 hover:text-kinetic transition-colors">Features</Link>
            <Link href="#benefits" className="text-sm font-medium text-foreground/70 hover:text-kinetic transition-colors">Benefits</Link>
            <Link href="#pricing" className="text-sm font-medium text-foreground/70 hover:text-kinetic transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-foreground/80 hover:text-kinetic transition-colors">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-bold bg-foreground text-background hover:scale-105 active:scale-95 px-5 py-2.5 rounded-full transition-all duration-300 shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-40 pb-20 px-6 md:pt-48 md:pb-32 flex flex-col items-center text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-kinetic/30 bg-kinetic/5 text-xs font-bold uppercase tracking-widest text-kinetic"
        >
          <Star className="w-3.5 h-3.5" />
          <span>The New Standard in Productivity</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-space-grotesk font-black mb-6 leading-[1.05] tracking-tighter">
          <TypewriterText text="Your Priorities" />
          <span className="text-transparent bg-clip-text verdant-gradient mt-2 block">Simplified.</span>
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl font-medium leading-relaxed"
        >
          Effortlessly organize your life, automate workflows, and achieve kinetic clarity with the most beautiful task manager ever built.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link 
            href="/signup" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 verdant-gradient text-background font-bold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]"
          >
            Start Free <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
          <Link 
            href="#demo" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#18221d]/5 border border-outline hover:bg-[#18221d]/10 font-bold px-8 py-4 rounded-full transition-all duration-300"
          >
            <Play className="w-5 h-5" /> Watch Demo
          </Link>
        </motion.div>

        {/* Floating elements inside Hero */}
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute left-0 top-[20%] glass border border-outline p-4 rounded-2xl shadow-xl flex-col gap-2 items-start"
        >
          <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-kinetic"></div><div className="w-24 h-2 bg-[#18221d]/10 rounded-full"></div></div>
          <div className="w-32 h-2 bg-[#18221d]/5 rounded-full"></div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute right-0 top-[40%] glass border border-outline p-4 rounded-2xl shadow-xl flex-col gap-3 items-start"
        >
          <div className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-verdant-primary" /><div className="w-20 h-2 bg-[#18221d]/10 rounded-full mt-1.5"></div></div>
        </motion.div>
      </section>

      {/* --- DEMO PARALLAX SECTION --- */}
      <section id="demo" className="relative z-10 px-6 max-w-6xl mx-auto w-full mb-32">
        <motion.div style={{ y: demoY }} className="relative rounded-[2rem] border border-outline/10 bg-black/40 glass shadow-2xl p-2 md:p-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          
          <div className="rounded-2xl border border-outline overflow-hidden relative">
            {/* Window controls */}
            <div className="absolute top-0 w-full h-8 bg-surface/50 border-b border-outline flex items-center px-4 gap-2 z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#8fd4b9]/80"></div>
            </div>
            {/* The "Screenshot" App Placeholder */}
            <div className="w-full h-[400px] md:h-[600px] bg-[#0A0D0B] pt-8 p-6 flex gap-6">
              {/* Sidebar */}
              <div className="hidden md:flex w-64 h-full border-r border-outline/10 flex-col gap-4">
                <div className="w-32 h-6 bg-[#18221d]/5 rounded-md mb-8"></div>
                <div className="w-full h-10 bg-[#18221d]/5 rounded-xl"></div>
                <div className="w-full h-10 bg-[#18221d]/5 rounded-xl"></div>
                <div className="w-full h-10 bg-kinetic/10 border border-kinetic/30 rounded-xl"></div>
              </div>
              {/* Kanban Mock */}
              <div className="flex-1 h-full flex gap-4 pt-10">
                <div className="flex-1 h-full bg-[#18221d]/5 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="w-24 h-4 bg-[#18221d]/10 rounded-full mb-4"></div>
                  <div className="w-full h-24 bg-surface rounded-xl border border-outline/10"></div>
                  <div className="w-full h-32 bg-surface rounded-xl border border-outline/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-kinetic" />
                  </div>
                </div>
                <div className="hidden sm:flex flex-1 h-full bg-[#18221d]/5 rounded-2xl p-4 flex-col gap-3">
                  <div className="w-32 h-4 bg-[#18221d]/10 rounded-full mb-4"></div>
                  <div className="w-full h-20 bg-surface rounded-xl border border-outline/10"></div>
                </div>
                <div className="hidden lg:flex flex-1 h-full bg-[#18221d]/5 rounded-2xl p-4 flex-col gap-3">
                  <div className="w-20 h-4 bg-[#18221d]/10 rounded-full mb-4"></div>
                </div>
              </div>
            </div>
          </div>
          
        </motion.div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="relative z-10 py-24 bg-surface px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-4">Everything you need. <br/><span className="text-foreground/50">Nothing you don't.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Layout, title: "Flexible Kanban", desc: "Visualize your workflow. Drag and drop tasks with buttery smooth friction-less mechanics." },
              { icon: BarChart3, title: "Smart Insights", desc: "Gain deep productivity metrics. Track your velocity and optimize your daily routines." },
              { icon: Activity, title: "Daily Streaks", desc: "Build momentum. Track your consecutive task completion and gamify your productivity." }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="glass p-8 rounded-[2rem] border border-outline/10 overflow-hidden relative group"
                key={i}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-kinetic/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 bg-surface rounded-2xl mb-8 flex items-center justify-center text-kinetic border border-outline shadow-xl group-hover:scale-110 group-hover:bg-kinetic group-hover:text-surface transition-all duration-500">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold font-space-grotesk mb-4">{feature.title}</h3>
                <p className="text-foreground/60 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section id="benefits" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-space-grotesk font-bold mb-6">Built for professionals, teams, and students.</h2>
            <p className="text-lg text-foreground/70 mb-10 leading-relaxed">
              Whether you are managing a massive enterprise project or organizing your university exams, Prio scales dynamically to meet your cognitive load.
            </p>

            <div className="flex flex-col gap-4">
              {[
                "Zero clutter interface",
                "Lightning fast shortcut driven",
                "Absolute privacy with Supabase",
                "Always in sync, universally"
              ].map((benefit, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  key={i}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-kinetic/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-kinetic" />
                  </div>
                  <span className="font-bold text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Visual Abstract Layout */}
            <div className="aspect-square w-full max-w-md mx-auto relative relative z-10">
              <div className="absolute inset-0 bg-verdant-primary/20 blur-[100px] rounded-full" />
              <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] glass border border-outline rounded-[3rem] p-6 shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-700">
                <div className="w-full h-full border border-dashed border-kinetic/30 rounded-3xl flex flex-col items-center justify-center gap-4 text-kinetic/50">
                   <Layers className="w-16 h-16" />
                   <span className="font-space-grotesk font-bold uppercase tracking-widest text-sm">Dynamic Architecture</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="relative z-10 py-24 border-y border-outline/10 bg-[#18221d]/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: 10, suffix: "K+", label: "Tasks Completed" },
            { value: 5, suffix: "K+", label: "Active Users" },
            { value: 99, suffix: "%", label: "Satisfaction" },
            { value: 24, suffix: "/7", label: "Global Support" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-5xl md:text-6xl font-space-grotesk font-black text-transparent bg-clip-text verdant-gradient mb-2">
                <Counter from={0} to={stat.value} suffix={stat.suffix} />
              </div>
              <span className="text-foreground/70 font-bold uppercase tracking-widest text-xs md:text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative z-10 py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-verdant-primary/10 pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-3xl mb-8 verdant-gradient flex items-center justify-center shadow-[0_0_40px_rgba(45,212,191,0.4)]">
            <CheckCircle2 className="w-10 h-10 text-surface" />
          </div>
          <h2 className="text-5xl md:text-7xl font-space-grotesk font-black mb-6">Start your kinetic workflow today.</h2>
          <p className="text-xl text-foreground/70 mb-10 max-w-2xl">Join the thousands who have upgraded their mental operating system. Free forever for individuals.</p>
          <Link 
            href="/signup" 
            className="text-lg flex items-center gap-2 bg-foreground text-background font-bold px-10 py-5 rounded-full hover:scale-105 active:scale-95 transition-transform duration-300 shadow-2xl"
          >
            Get Started for Free <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <p className="mt-6 text-sm text-foreground/40 font-medium">No credit card required. Setup in 30 seconds.</p>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-outline/10 bg-surface py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-kinetic" />
            <span className="text-xl font-bold font-space-grotesk">Prio</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-foreground/60">
            <Link href="#" className="hover:text-kinetic transition-colors">Product</Link>
            <Link href="#" className="hover:text-kinetic transition-colors">Company</Link>
            <Link href="#" className="hover:text-kinetic transition-colors">Resources</Link>
            <Link href="#" className="hover:text-kinetic transition-colors">Legal</Link>
          </div>
          
          <div className="flex items-center gap-4 text-foreground/40">
            <span className="text-sm">Â© {(new Date()).getFullYear()} Prio Task Manager. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}



