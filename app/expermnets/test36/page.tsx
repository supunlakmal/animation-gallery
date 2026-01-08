"use client";

import { useEffect, useRef } from "react";

const CONFIG = {
  particleCount: 300,
  pullStrength: 0.1,
  friction: 0.95,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function GravitationalVoid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    mouseRef.current = { x: width / 2, y: height / 2 };

    const particles: Particle[] = Array.from({ length: CONFIG.particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: Math.random(),
    }));

    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Draw Void Core
      const grad = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 50);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(0.1, "#fff");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 50, 0, Math.PI * 2);
      ctx.fill();

      particles.forEach((p) => {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 10) {
            p.x = Math.random() * width;
            p.y = Math.random() * height;
            p.vx = (Math.random() - 0.5) * 5;
            p.vy = (Math.random() - 0.5) * 5;
        }

        const force = 1000 / (dist * dist + 100);
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;

        p.vx *= CONFIG.friction;
        p.vy *= CONFIG.friction;

        p.x += p.vx;
        p.y += p.vy;

        ctx.strokeStyle = `rgba(100, 200, 255, ${Math.min(1, force * 0.5)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-black" />;
}
