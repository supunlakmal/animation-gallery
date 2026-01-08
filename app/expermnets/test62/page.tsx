"use client";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function FlowFieldV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const noise3D = createNoise3D(Math.random);

  const config = {
    particleCount: 1000,
    noiseScale: 0.005,
    timeScale: 0.0005,
    speed: 0.5,
    colors: ["#FF0055", "#00FF55", "#5500FF", "#FFFF00"],
  };

  const resetParticle = (p: Particle, w: number, h: number) => {
    p.x = Math.random() * w;
    p.y = Math.random() * h;
    p.life = Math.random() * 100 + 50;
    p.color = config.colors[Math.floor(Math.random() * config.colors.length)];
    return p;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.globalCompositeOperation = "lighter"; // Magical blending
    };
    resize();
    window.addEventListener("resize", resize);

    // Init
    particlesRef.current = Array.from({ length: config.particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      life: Math.random() * 100,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
    }));

    const animate = (time: number) => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)"; // Fade
      ctx.fillRect(0, 0, width, height);

      const t = time * config.timeScale;

      particlesRef.current.forEach((p) => {
        const noiseVal = noise3D(p.x * config.noiseScale, p.y * config.noiseScale, t);
        const angle = noiseVal * Math.PI * 4;

        p.vx += Math.cos(angle) * 0.1;
        p.vy += Math.sin(angle) * 0.1;
        
        // Limit speed
        const vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (vel > 2) {
          p.vx = (p.vx / vel) * 2;
          p.vy = (p.vy / vel) * 2;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        // Draw
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Bounds/Reset
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.life <= 0) {
          resetParticle(p, width, height);
          p.vx = 0; 
          p.vy = 0;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-black"
    />
  );
}
