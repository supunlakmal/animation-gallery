"use client";

import { useEffect, useRef } from "react";

export default function Swarm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    class Boid {
      x: number;
      y: number;
      vx: number;
      vy: number;
      
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 - 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        const angle = Math.atan2(this.vy, this.vx);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-5, 5);
        ctx.lineTo(-5, -5);
        ctx.closePath();
        ctx.fillStyle = "#ff6b6b";
        ctx.fill();
        ctx.restore();
      }
    }

    const boids = Array.from({ length: 200 }, () => new Boid());
    let animationId: number;

    const animate = () => {
      ctx.fillStyle = "rgba(30, 30, 35, 0.2)";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < boids.length; i++) {
        // Simple separation rule
        const b = boids[i];
        let dx = 0;
        let dy = 0;
        
        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const other = boids[j];
          const dist = Math.hypot(b.x - other.x, b.y - other.y);
          if (dist < 30) {
            dx += b.x - other.x;
            dy += b.y - other.y;
          }
        }
        
        b.vx += dx * 0.005;
        b.vy += dy * 0.005;

        // Speed limit
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > 4) {
          b.vx = (b.vx / speed) * 4;
          b.vy = (b.vy / speed) * 4;
        }

        b.update();
        b.draw();
      }

      animationId = requestAnimationFrame(animate);
    };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-[#1e1e23] relative overflow-hidden">
        <div className="absolute bottom-8 right-8 text-[#ff6b6b] z-10 font-mono">
            TEST 40 // SWARM
        </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
