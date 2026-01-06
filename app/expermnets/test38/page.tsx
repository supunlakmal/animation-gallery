"use client";

import React, { useEffect, useRef } from "react";

/**
 * Neon Fluid Particles
 * A modern, interactive particle system with fluid-like motion and vibrant neon aesthetics.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: { x: number; y: number }[];
  hue: number;
  size: number;
}

export default function NeonFluidParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId: number;
    let particles: Particle[] = [];

    // Configuration
    const particleCount = 150;
    const connectionDistance = 100;
    const mouseInfluenceRadius = 250;
    const mouseForce = 0.8;
    const friction = 0.96;
    const baseSpeed = 2;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * baseSpeed,
          vy: (Math.random() - 0.5) * baseSpeed,
          history: [],
          hue: Math.random() * 60 + 180, // Cyan to Blue range
          size: Math.random() * 2 + 1,
        });
      }
    };

    const update = () => {
      // Create a fading trail effect
      ctx.fillStyle = "rgba(10, 10, 15, 0.2)"; // Dark background with slight transparency for trails
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p, i) => {
        // Wrapper collision
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse interaction
        if (mouseRef.current.isActive) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseInfluenceRadius) {
            const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius;
            const angle = Math.atan2(dy, dx);
            const fx = Math.cos(angle) * force * mouseForce;
            const fy = Math.sin(angle) * force * mouseForce;

            p.vx += fx;
            p.vy += fy;
          }
        }

        // Physics
        p.vx *= friction;
        p.vy *= friction;
        
        // Minimum movement to keep it alive
        if (Math.abs(p.vx) < 0.1 && Math.abs(p.vy) < 0.1) {
            p.vx += (Math.random() - 0.5) * 0.5;
            p.vy += (Math.random() - 0.5) * 0.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // History for trails could be added here if we wanted separate trails per particle, 
        // but global fade is more performant and fluid.

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${p.hue}, 100%, 70%)`;
        ctx.fill();

        // Draw Connections
        // Connecting nearby particles creates the "plexus" or "fluid" look
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                const alpha = 1 - dist / connectionDistance;
                ctx.strokeStyle = `hsla(${p.hue}, 100%, 60%, ${alpha * 0.5})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
      });

      animationId = requestAnimationFrame(update);
    };

    // Events
    window.addEventListener("resize", resize);
    
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isActive = true;
    };
    
    const onMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave); // Handle mouse leaving window

    // Initial setup
    resize();
    initParticles();
    update();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a0f] overflow-hidden">
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 opacity-20 select-none tracking-widest blur-sm animate-pulse">
            NEON FLUID
          </h1>
      </div>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
