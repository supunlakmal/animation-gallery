"use client";

import { useEffect, useRef } from "react";

const CONFIG = {
  orbCount: 20,
  minRadius: 5,
  maxRadius: 15,
  spring: 0.05,
  friction: 0.85,
  gravity: 0.1,
  colors: ["#FF3E00", "#FFBE00", "#40B3FF", "#676778"],
};

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function GravitationalOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    mouseRef.current = { x: width / 2, y: height / 2 };

    const orbs: Orb[] = Array.from({ length: CONFIG.orbCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      radius: Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius,
      color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.2)";
      ctx.fillRect(0, 0, width, height);

      orbs.forEach((orb) => {
        const dx = mouseRef.current.x - orb.x;
        const dy = mouseRef.current.y - orb.y;
        
        orb.vx += dx * CONFIG.spring;
        orb.vy += dy * CONFIG.spring;
        
        orb.vx *= CONFIG.friction;
        orb.vy *= CONFIG.friction;
        
        orb.x += orb.vx;
        orb.y += orb.vy;

        ctx.beginPath();
        ctx.fillStyle = orb.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = orb.color;
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-[#0a0a0a]" />;
}
