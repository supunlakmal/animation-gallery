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
    <main className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-6 py-16 sm:px-8 sm:py-20 md:px-16 md:py-24 relative overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0">
        {/* Warm Gradient Orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] rounded-full blur-[120px] md:blur-[180px]" 
          style={{ background: 'radial-gradient(circle, rgba(212,165,116,0.12) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] rounded-full blur-[100px] md:blur-[150px]" 
          style={{ background: 'radial-gradient(circle, rgba(139,115,85,0.1) 0%, transparent 70%)' }}
        />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundSize: "80px 80px",
            backgroundImage: `
              linear-gradient(to right, rgba(212,165,116,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(212,165,116,0.15) 1px, transparent 1px)
            `
          }}
        />
        
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-8">
          <iframe 
            src="/expermnets/test2" 
            className="w-full h-full border-none pointer-events-none scale-110"
            title="Background"
          />
        </div>
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-transparent to-[#0d0d0d]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/60 via-transparent to-[#0d0d0d]/60" />
        
        {/* Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(13,13,13,0.8) 100%)'
          }}
        />
      </div>

      {/* Main Content - Increased max-width and spacing */}
      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center">
        
        {/* Collection Status Badge - More top margin */}
        <div className="mb-14 sm:mb-16 md:mb-20 flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-3 sm:py-3.5 bg-[#141414]/60 backdrop-blur-sm border border-[rgba(212,165,116,0.12)] rounded-full">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-[#7eb77f] rounded-full" />
            <div className="absolute inset-0 w-2.5 h-2.5 bg-[#7eb77f] rounded-full animate-ping opacity-50" />
          </div>
          <span className="text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[#9a9590] font-light">
            Collection Active
          </span>
          <div className="w-px h-4 bg-[rgba(212,165,116,0.15)] hidden sm:block" />
          <span className="text-[11px] sm:text-xs text-[#6b6560] font-mono hidden sm:inline">{time}</span>
        </div>

        {/* Hero Section - Increased vertical spacing */}
        <div className="space-y-10 sm:space-y-12 md:space-y-14 mb-14 sm:mb-16 md:mb-20">
          
          {/* Main Title - Larger line height */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-[-0.03em] leading-[1.1]">
            <span className="block text-[#faf8f5]/90 mb-3 sm:mb-4">Animation</span>
            <span className="block bg-gradient-to-r from-[#d4a574] via-[#faf8f5] to-[#e8c9a8] bg-clip-text text-transparent">
              Archive
            </span>
          </h1>
          
          {/* Elegant Divider - More breathing room */}
          <div className="flex items-center justify-center gap-4 sm:gap-5 py-2">
            <div className="w-16 sm:w-20 md:w-28 h-px bg-gradient-to-r from-transparent to-[rgba(212,165,116,0.35)]" />
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-[#d4a574]/30 rotate-45" />
              <div className="w-2 h-2 bg-[#d4a574]/50 rotate-45" />
              <div className="w-1 h-1 bg-[#d4a574]/30 rotate-45" />
            </div>
            <div className="w-16 sm:w-20 md:w-28 h-px bg-gradient-to-l from-transparent to-[rgba(212,165,116,0.35)]" />
          </div>
          
          {/* Subtitle - More line height and padding */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#9a9590] font-light max-w-lg mx-auto leading-relaxed px-2">
            A curated collection of{" "}
            <span className="text-[#d4a574] font-normal">184+</span>{" "}
            procedural experiments, particle systems, and visual algorithms.
          </p>
        </div>
        
        {/* CTA Buttons - More spacing between and around */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center mb-16 sm:mb-20 md:mb-24 w-full sm:w-auto px-4 sm:px-0">
          <Link 
            href="/expermnets" 
            className="group relative w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#d4a574] to-[#a67c4e] text-[#0d0d0d] font-medium tracking-wider text-sm uppercase rounded overflow-hidden transition-all hover:shadow-[0_0_50px_rgba(212,165,116,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10">Enter Archive</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#e8c9a8] to-[#d4a574] opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          
          <a 
            href="https://github.com/supunlakmal/anaimated_slider" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 border border-[rgba(212,165,116,0.2)] text-[#9a9590] hover:text-[#faf8f5] hover:border-[rgba(212,165,116,0.45)] hover:bg-[rgba(212,165,116,0.05)] transition-all font-light tracking-wider text-sm uppercase rounded text-center"
          >
            View Source
          </a>
        </div>

        {/* Stats Row - More generous spacing */}
        <div className="grid grid-cols-3 gap-6 sm:gap-10 md:gap-20 text-center w-full max-w-xl">
          <div className="group py-4 sm:py-6">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extralight text-[#faf8f5]/90 mb-2 sm:mb-3 group-hover:text-[#d4a574] transition-colors duration-300">
              184+
            </div>
            <div className="text-[10px] sm:text-xs text-[#6b6560] uppercase tracking-[0.18em]">
              Specimens
            </div>
          </div>
          <div className="group py-4 sm:py-6">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extralight text-[#faf8f5]/90 mb-2 sm:mb-3 group-hover:text-[#d4a574] transition-colors duration-300">
              Next.js
            </div>
            <div className="text-[10px] sm:text-xs text-[#6b6560] uppercase tracking-[0.18em]">
              Framework
            </div>
          </div>
          <div className="group py-4 sm:py-6">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extralight text-[#faf8f5]/90 mb-2 sm:mb-3 group-hover:text-[#d4a574] transition-colors duration-300">
              Canvas
            </div>
            <div className="text-[10px] sm:text-xs text-[#6b6560] uppercase tracking-[0.18em]">
              Rendering
            </div>
          </div>
        </div>
      </div>

      {/* Corner Decorations - Desktop Only */}
      <div className="absolute top-8 left-8 hidden lg:flex items-center gap-4">
        <div className="w-10 h-px bg-[rgba(212,165,116,0.2)]" />
        <span className="text-[10px] text-[#6b6560] uppercase tracking-widest font-mono">V2.0</span>
      </div>
      
      <div className="absolute top-8 right-8 hidden lg:block">
        <span className="text-[10px] text-[#6b6560] uppercase tracking-widest font-mono">EST. 2024</span>
      </div>

      <div className="absolute bottom-8 left-8 hidden lg:block">
        <span className="text-[10px] text-[#6b6560] uppercase tracking-widest font-mono">
          ARCHIVE.OPERATIONAL
        </span>
      </div>
      
      <div className="absolute bottom-8 right-8 hidden lg:flex items-center gap-4">
        <span className="text-[10px] text-[#6b6560] uppercase tracking-widest">Explore</span>
        <div className="w-10 h-px bg-[rgba(212,165,116,0.2)]" />
      </div>

      {/* Subtle Paper Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </main>
  );
}
