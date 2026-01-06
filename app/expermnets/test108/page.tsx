"use client";
import { useEffect, useRef } from "react";

export default function BouncingText() {
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

    const phrases = ["NEXTjs", "React", "Node", "Canvas", "TypeScript", "Vercel", "Tailwind", "CSS"];
    
    interface Item {
        text: string;
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        fontSize: number;
    }
    
    const items: Item[] = [];
    
    for(let i=0; i<15; i++) {
        items.push({
            text: phrases[Math.floor(Math.random() * phrases.length)],
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            fontSize: 20 + Math.random() * 40
        });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(0, 0, width, height);

      items.forEach(item => {
          ctx.font = `bold ${item.fontSize}px sans-serif`;
          const metrics = ctx.measureText(item.text);
          const w = metrics.width;
          const h = item.fontSize; // Approx height

          item.x += item.vx;
          item.y += item.vy;

          if (item.x < 0 || item.x + w > width) {
             item.vx *= -1;
             item.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
          }
          
          if (item.y - h < 0 || item.y > height) { // Text draws from bottom-left usually
             item.vy *= -1;
             item.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
          }

          ctx.fillStyle = item.color;
          ctx.fillText(item.text, item.x, item.y);
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-white -z-10" />;
}
