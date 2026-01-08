"use client";
import React, { useEffect, useRef } from "react";

export default function FireSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
      color: string;

      constructor() {
        this.x = width / 2 + (Math.random() - 0.5) * 50;
        this.y = height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * -3 - 2;
        this.life = 1;
        this.size = Math.random() * 20 + 10;
        // Fire colors
        const r = 255;
        const g = Math.floor(Math.random() * 150);
        const b = 0;
        this.color = `rgba(${r}, ${g}, ${b}`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.01;
        this.size *= 0.98;
        this.vy *= 0.99; // Slow down ascent
      }

      draw() {
        context.beginPath();
        context.fillStyle = `${this.color}, ${this.life})`;
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        
        // Glow
        context.shadowBlur = 20;
        context.shadowColor = `${this.color}, 1)`;
      }
    }

    const particles: Particle[] = [];

    const animate = () => {
      context.globalCompositeOperation = "source-over";
      context.fillStyle = "black";
      context.fillRect(0, 0, width, height);
      
      context.globalCompositeOperation = "lighter"; // Additive blending for fire

      // Spawn
      for (let i = 0; i < 5; i++) {
         particles.push(new Particle());
      }

      for (let i = particles.length - 1; i >= 0; i--) {
         const p = particles[i];
         p.update();
         p.draw();
         if (p.life <= 0) {
             particles.splice(i, 1);
         }
      }

      // Reset
      context.shadowBlur = 0;
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    const frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />;
}
