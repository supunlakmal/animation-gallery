"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  hue: number;
}

export default function BioluminescentFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const noise2D = createNoise2D();

  const config = {
    particleCount: 150,
    baseSpeed: 0.5,
    noiseScale: 0.005,
    colorSpeed: 0.2,
    mouseRepelDist: 150,
    mouseRepelForce: 2,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    const mouse = { x: -1000, y: -1000 };

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < config.particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
          hue: Math.random() * 60 + 160, // Cyan/Teal range
        });
      }
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    initParticles();

    const animate = () => {
      time += config.colorSpeed;
      
      // Clear with trail effect
      ctx.fillStyle = "rgba(10, 20, 30, 0.2)";
      ctx.fillRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        // Flow field movement
        const noiseVal = noise2D(p.x * config.noiseScale, p.y * config.noiseScale + time * 0.002);
        const angle = noiseVal * Math.PI * 2;
        
        p.vx += Math.cos(angle) * 0.02;
        p.vy += Math.sin(angle) * 0.02;
        
        // Dampen velocity
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        // Mouse interaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < config.mouseRepelDist) {
            const force = (config.mouseRepelDist - dist) / config.mouseRepelDist;
            p.vx += (dx / dist) * force * config.mouseRepelForce;
            p.vy += (dy / dist) * force * config.mouseRepelForce;
        }

        // Apply speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > config.baseSpeed * 4) {
             p.vx = (p.vx / speed) * config.baseSpeed * 4;
             p.vy = (p.vy / speed) * config.baseSpeed * 4;
        }

        p.x += p.vx + Math.cos(angle) * config.baseSpeed;
        p.y += p.vy + Math.sin(angle) * config.baseSpeed;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + Math.sin(time * 0.05) * 30}, 80%, 60%, ${p.alpha})`;
        ctx.fill();
        
        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, 0.5)`;
      });
      
      ctx.shadowBlur = 0;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#0a141e]" />;
}
