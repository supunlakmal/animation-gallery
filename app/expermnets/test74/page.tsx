"use client";
import React, { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export default function SmokeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const noise2D = createNoise2D(Math.random);

  interface SmokeParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    rotation: number;
  }

  const particles = useRef<SmokeParticle[]>([]);

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
    };
    window.addEventListener("resize", resize);

    const spawn = () => {
      particles.current.push({
        x: width / 2,
        y: height + 50,
        vx: (Math.random() - 0.5) * 1,
        vy: -Math.random() * 2 - 1,
        size: Math.random() * 30 + 20,
        life: 0,
        maxLife: Math.random() * 200 + 100,
        rotation: Math.random() * Math.PI * 2
      });
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, width, height);

      // Spawn
      if (Math.random() > 0.8) spawn();

      const t = time * 0.0005;

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        
        // Noise influenced movement
        const n = noise2D(p.x * 0.005, p.y * 0.005 + t);
        p.x += Math.sin(n * 5) * 0.5;
        p.y += p.vy; // Rise up
        
        p.size += 0.2; // Expand
        p.life++;
        p.rotation += 0.01;

        if (p.life > p.maxLife) {
            particles.current.splice(i, 1);
            continue;
        }

        // Draw puff
        const alpha = 1 - p.life / p.maxLife;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        ctx.fillStyle = `rgba(150, 150, 150, ${alpha * 0.1})`;
        ctx.beginPath();
        // Draw a soft rect/circle
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ filter: "blur(5px)" }} // Extra soften
    />
  );
}
