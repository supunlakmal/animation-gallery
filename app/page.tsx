"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundSize: "60px 60px",
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `
          }}
        />
        
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-15">
          <iframe 
            src="/expermnets/test2" 
            className="w-full h-full border-none pointer-events-none scale-110"
            title="Background"
          />
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/50 via-transparent to-[#030303]/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        
        {/* Status Badge */}
        <div className="mb-16 flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-xs tracking-[0.2em] uppercase text-gray-400 font-light">
            Archive Online
          </span>
          <span className="text-xs text-gray-600 font-mono">{time}</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-8 mb-16">
          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-[-0.04em] leading-[0.9]">
            <span className="block text-white/90">Animation</span>
            <span className="block bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              Archive
            </span>
          </h1>
          
          {/* Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/30" />
            <div className="w-1.5 h-1.5 bg-cyan-400/50 rotate-45" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/30" />
          </div>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
            A curated collection of{" "}
            <span className="text-white/80">184+</span>{" "}
            procedural experiments, particle systems, and visual algorithms.
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-20">
          <Link 
            href="/expermnets" 
            className="group relative px-10 py-4 bg-gradient-to-r from-cyan-500/90 to-cyan-600/90 text-white font-medium tracking-wider text-sm uppercase rounded-sm overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Explore Archive</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          
          <a 
            href="https://github.com/supunlakmal/anaimated_slider" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group px-10 py-4 border border-white/20 text-gray-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all font-light tracking-wider text-sm uppercase rounded-sm"
          >
            View Source
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 md:gap-16 text-center">
          <div className="group">
            <div className="text-3xl md:text-4xl font-extralight text-white/90 mb-2 group-hover:text-cyan-300 transition-colors">
              184+
            </div>
            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em]">
              Experiments
            </div>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-extralight text-white/90 mb-2 group-hover:text-cyan-300 transition-colors">
              Next.js
            </div>
            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em]">
              Framework
            </div>
          </div>
          <div className="group">
            <div className="text-3xl md:text-4xl font-extralight text-white/90 mb-2 group-hover:text-cyan-300 transition-colors">
              Canvas
            </div>
            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em]">
              Rendering
            </div>
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 hidden md:flex items-center gap-3">
        <div className="w-8 h-px bg-white/20" />
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">V2.0</span>
      </div>
      
      <div className="absolute top-8 right-8 hidden md:block">
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">2024</span>
      </div>

      <div className="absolute bottom-8 left-8 hidden md:block">
        <span className="text-[10px] text-gray-600 uppercase tracking-widest font-mono">
          SYS.OPERATIONAL
        </span>
      </div>
      
      <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-3">
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">Scroll</span>
        <div className="w-8 h-px bg-white/20" />
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.015]" 
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)"
        }}
      />
    </main>
  );
}
