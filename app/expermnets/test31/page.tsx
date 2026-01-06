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
  maxLife: number;
  hue: number;
  size: number;
}

export default function CosmicFlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const noise3D = createNoise3D(Math.random);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // --- Configuration ---
  const config = {
    particleCount: 2000,
    baseSpeed: 1,
    noiseScale: 0.002,
    timeScale: 0.0001,
    colorSpeed: 0.2,
    baseHue: 220, // Blue/Cyan range
    hueRange: 60,
    backgroundColor: "rgba(5, 5, 10, 0.2)", // Dark trail fade
  };

  const resetParticle = (p?: Particle, x?: number, y?: number): Particle => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Spawn mostly in center if undefined, or random
    const px = x ?? Math.random() * w;
    const py = y ?? Math.random() * h;

    const newSize = Math.random() * 2 + 0.5;

    if (p) {
        p.x = px;
        p.y = py;
        p.vx = 0;
        p.vy = 0;
        p.life = Math.random() * 200 + 100;
        p.maxLife = p.life;
        p.hue = config.baseHue + Math.random() * config.hueRange;
        p.size = newSize;
        return p;
    }

    return {
      x: px,
      y: py,
      vx: 0,
      vy: 0,
      life: Math.random() * 200 + 100,
      maxLife: Math.random() * 200 + 100,
      hue: config.baseHue + Math.random() * config.hueRange,
      size: newSize,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-init particles on resize to avoid stretching weirdness
      particlesRef.current = Array.from({ length: config.particleCount }, () =>
        resetParticle()
      );
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial particles
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: config.particleCount }, () =>
        resetParticle()
      );
    }

    // --- Interaction ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    
    // Clear mouse active status after a delay
    let mouseTimeout: NodeJS.Timeout;
    const handleMouseStop = () => {
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            mouseRef.current.active = false;
        }, 1000);
    }

    window.addEventListener("mousemove", (e) => { handleMouseMove(e); handleMouseStop(); });

    // --- Animation Loop ---
    const animate = () => {
      // 1. Fade out trails
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Use "lighter" composite operation for glowing effect
      ctx.globalCompositeOperation = "lighter";

      const w = canvas.width;
      const h = canvas.height;
      time += config.timeScale;

      particlesRef.current.forEach((p) => {
        // Calculate noise value based on position and time
        const noiseVal = noise3D(
          p.x * config.noiseScale,
          p.y * config.noiseScale,
          time
        );
        
        // Map noise to angle: -1..1 -> 0..4PI (dynamic swirl)
        const angle = noiseVal * Math.PI * 4;

        // Calculate target velocity
        const targetVx = Math.cos(angle) * config.baseSpeed;
        const targetVy = Math.sin(angle) * config.baseSpeed;

        // Smoothly interpolate velocity
        p.vx += (targetVx - p.vx) * 0.1;
        p.vy += (targetVy - p.vy) * 0.1;

        // Mouse interaction (repel/attract)
        if (mouseRef.current.active) {
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 200;
            
            if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist;
                // Swirl around mouse
                p.vx += dy * force * 0.05;
                p.vy -= dx * force * 0.05;
                // Add some repulsion
                p.vx += dx * force * 0.02;
                p.vy += dy * force * 0.02;
            }
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Decay life
        p.life--;

        // Boundary wrap
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Reset dead particles
        if (p.life <= 0) {
          resetParticle(p);
        }

        // --- Draw ---
        const opacity = Math.min(p.life / 50, 1); // Fade out at end
        ctx.beginPath();
        // Dynamic color based on velocity or position
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const hue = p.hue + speed * 20;
        
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${opacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Reset composite operation for the background clear on next frame
      ctx.globalCompositeOperation = "source-over";

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none mix-blend-overlay">
        <h1 className="text-9xl font-bold text-white opacity-20 tracking-tighter">
          PULSE
        </h1>
      </div>
    </div>
  );
}
