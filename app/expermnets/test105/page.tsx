"use client";
import { useEffect, useRef } from "react";

export default function Fireflies() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    interface Fly {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      flashSpeed: number;
      flashOffset: number;
    }

    const flies: Fly[] = [];
    for (let i = 0; i < 50; i++) {
      flies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        radius: Math.random() * 3 + 1,
        alpha: 0,
        flashSpeed: 0.02 + Math.random() * 0.05,
        flashOffset: Math.random() * 100
      });
    }

    let time = 0;

    const animate = () => {
      // Dark night background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#020111");
      gradient.addColorStop(1, "#191923");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      time++;

      flies.forEach(fly => {
        // Update position
        fly.x += fly.vx;
        fly.y += fly.vy;

        // Bounce from edges
        if (fly.x < 0 || fly.x > width) fly.vx *= -1;
        if (fly.y < 0 || fly.y > height) fly.vy *= -1;

        // Randomly change direction slightly
        if (Math.random() < 0.01) {
            fly.vx += (Math.random() - 0.5) * 0.5;
            fly.vy += (Math.random() - 0.5) * 0.5;
        }

        // Flash logic
        fly.alpha = 0.5 + 0.5 * Math.sin(time * fly.flashSpeed + fly.flashOffset);

        // Draw glow
        ctx.beginPath();
        const glow = ctx.createRadialGradient(fly.x, fly.y, 0, fly.x, fly.y, fly.radius * 4);
        glow.addColorStop(0, `rgba(255, 255, 0, ${fly.alpha})`);
        glow.addColorStop(1, "rgba(255, 255, 0, 0)");
        ctx.fillStyle = glow;
        ctx.arc(fly.x, fly.y, fly.radius * 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 200, ${fly.alpha})`;
        ctx.arc(fly.x, fly.y, fly.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
