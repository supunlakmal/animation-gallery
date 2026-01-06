"use client";

import { useEffect, useRef } from "react";

const CONFIG = {
  particleCount: 2000,
  gravity: 0.2,
  friction: 0.98,
  mouseRadius: 100,
  mouseForce: 1.5,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export default function ParticleSand() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = Array.from({ length: CONFIG.particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      color: `hsl(${20 + Math.random() * 30}, 70%, ${50 + Math.random() * 20}%)`,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(20, 15, 10, 0.3)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.vy += CONFIG.gravity;
        
        // Mouse interaction
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < CONFIG.mouseRadius) {
          const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= CONFIG.friction;
        p.vy *= CONFIG.friction;
        
        p.x += p.vx;
        p.y += p.vy;

        // Ground/Wall bounce
        if (p.y > height) {
          p.y = height;
          p.vy *= -0.5;
        }
        if (p.x < 0 || p.x > width) p.vx *= -0.8;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-[#140f0a]" />;
}
