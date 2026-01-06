"use client";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

// --- Types ---
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
}

const config = {
  particleCount: 800,
  noiseScale: 0.002,
  speed: 0.15,
  friction: 0.98,
  mouseRadius: 250,
  vortexStrength: 0.5,
};

export default function NeuralVoid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isMoving: false });
  const noise3D = createNoise3D();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    let time = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = Array.from({ length: config.particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        life: Math.random(),
        hue: 180 + Math.random() * 60,
        size: 1 + Math.random() * 2,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isMoving = true;
    };

    const animate = (t: number) => {
      time = t * 0.0005;
      
      // Motion blur effect
      ctx.fillStyle = "rgba(5, 5, 10, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      particles.forEach((p) => {
        // Flow field from noise
        const n = noise3D(p.x * config.noiseScale, p.y * config.noiseScale, time) * Math.PI * 4;
        p.vx += Math.cos(n) * config.speed;
        p.vy += Math.sin(n) * config.speed;

        // Mouse interaction (Vortex)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.mouseRadius) {
          const force = (1 - dist / config.mouseRadius) * config.vortexStrength;
          // Perpendicular vector for vortex
          p.vx += (dy / dist) * force;
          p.vy += (-dx / dist) * force;
          // Slight attraction
          p.vx += (dx / dist) * force * 0.2;
          p.vy += (dy / dist) * force * 0.2;
        }

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= config.friction;
        p.vy *= config.friction;

        // Lifecycle and wrapping
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        // Drawing with chromatic aberration effect
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const opacity = Math.min(1, speed * 0.2);
        
        ctx.globalCompositeOperation = "lighter";
        
        // Main particle
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Trail/Aura
        if (speed > 1) {
          ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${opacity * 0.5})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
          ctx.stroke();
        }

        ctx.globalCompositeOperation = "source-over";
      });

      requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#05050a]">
      <canvas ref={canvasRef} className="block w-full h-full cursor-none" />
      
      {/* Custom Cursor */}
      <div 
        className="fixed top-0 left-0 w-12 h-12 -ml-6 -mt-6 rounded-full border border-cyan-400/20 pointer-events-none mix-blend-screen transition-all duration-300 ease-out z-50 flex items-center justify-center"
        style={{ 
          transform: `translate(${mouseRef.current.targetX}px, ${mouseRef.current.targetY}px)`,
          backdropFilter: "blur(2px)" 
        }}
      >
        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
      </div>

      {/* Post-Processing Layers */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,10,0.8)_100%)]" />
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
          backgroundSize: "100% 2px, 3px 100%"
        }}
      />

      <style jsx global>{`
        body { margin: 0; padding: 0; background: #05050a; overflow: hidden; }
        ::selection { background: rgba(34, 211, 238, 0.2); }
      `}</style>
    </div>
  );
}
