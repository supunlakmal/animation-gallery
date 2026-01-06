"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export default function NeonFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise3D = createNoise3D(Math.random);
    let time = 0;
    
    // Config
    const particleCount = 2000;
    const noiseScale = 0.005;
    const speed = 1.5;
    const colors = ["#00f2ff", "#ff0099", "#bd00ff", "#ffee00"];

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
    }

    const particles: Particle[] = [];

    const initParticle = (p?: Particle): Particle => {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: Math.random() * 200 + 100,
        ...p,
      };
    };

    for (let i = 0; i < particleCount; i++) {
        particles.push(initParticle());
    }

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const animate = () => {
      // Fade effect
      ctx.fillStyle = "rgba(10, 10, 15, 0.1)"; // Dark trail
      ctx.fillRect(0, 0, w, h);

      time += 0.002;

      particles.forEach((p) => {
        // Noise field direction
        const n = noise3D(p.x * noiseScale, p.y * noiseScale, time);
        const angle = n * Math.PI * 4;

        p.vx += Math.cos(angle) * 0.1;
        p.vy += Math.sin(angle) * 0.1;

        // Friction and speed limit
        p.vx *= 0.95;
        p.vy *= 0.95;
        
        // Apply constant speed push in direction of angle to keep them moving
        p.vx += Math.cos(angle) * 0.05;
        p.vy += Math.sin(angle) * 0.05;

        p.x += p.vx * speed;
        p.y += p.vy * speed;

        // Wrap
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Draw
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div className="absolute top-8 left-8 text-white z-10 pointer-events-none mix-blend-difference">
         <h1 className="text-4xl font-bold tracking-tighter uppercase">Neon Flow</h1>
         <p className="text-sm opacity-50">Simplex Noise Field</p>
      </div>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
