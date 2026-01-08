"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

// --- Configuration ---
const CONFIG = {
  particleCount: 120,
  minRadius: 40,
  maxRadius: 180,
  mouseForce: 0.05,
  friction: 0.96,
  gravity: 0.02,
  noiseScale: 0.002,
  noiseSpeed: 0.005,
  colors: [
    "hsla(280, 80%, 60%, 0.8)", // Purple
    "hsla(200, 90%, 50%, 0.8)", // Blue
    "hsla(160, 80%, 45%, 0.8)", // Teal
    "hsla(320, 80%, 60%, 0.8)", // Pink
  ],
  bg: "#050505",
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  targetRadius: number;
}

export default function LiquidVortex() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const noise2D = createNoise2D();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      const particles: Particle[] = [];
      for (let i = 0; i < CONFIG.particleCount; i++) {
        const radius = Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: radius,
          targetRadius: radius,
          color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
        });
      }
      particlesRef.current = particles;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const animate = () => {
      timeRef.current += CONFIG.noiseSpeed;
      const t = timeRef.current;

      // Clear with slight alpha for motion blur if needed, 
      // but here we use the CSS filter trick for metaballs
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        // Noise Influence
        const n = noise2D(p.x * CONFIG.noiseScale, p.y * CONFIG.noiseScale + t);
        const noiseAngle = n * Math.PI * 4;
        p.vx += Math.cos(noiseAngle) * 0.1;
        p.vy += Math.sin(noiseAngle) * 0.1;

        // Mouse Influence
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400) {
            const force = (1 - dist / 400) * CONFIG.mouseForce;
            p.vx += dx * force;
            p.vy += dy * force;
            p.targetRadius = CONFIG.maxRadius * (1 + (1 - dist / 400) * 0.5);
          } else {
            p.targetRadius = p.radius;
          }
        }

        // Apply Physics
        p.vx *= CONFIG.friction;
        p.vy *= CONFIG.friction;
        p.x += p.vx;
        p.y += p.vy;

        // Radius smoothing
        const currentR = p.radius + (p.targetRadius - p.radius) * 0.1;
        p.radius = currentR;

        // Boundaries with bounce
        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        // Draw Particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    init();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#050505] flex items-center justify-center"
    >
      {/* The "Liquid" Effect Container */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          filter: "blur(25px) contrast(30)",
          background: "black",
        }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
      </div>

      {/* Glass Overlay for depth */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
      </div>

      {/* Custom Cursor Glow */}
      <style jsx global>{`
        body {
          margin: 0;
          cursor: crosshair;
          background: #000;
          overflow: hidden;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
