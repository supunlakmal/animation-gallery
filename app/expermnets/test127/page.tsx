"use client";
import { useEffect, useRef } from "react";

export default function SmokePuffs() {
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

    interface Puff {
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
        alpha: number;
        growth: number;
    }
    
    const puffs: Puff[] = [];
    
    const animate = () => {
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, width, height);
      
      // Spawn
      if (Math.random() > 0.8) {
          puffs.push({
              x: Math.random() * width,
              y: height + 50,
              vx: (Math.random() - 0.5) * 2,
              vy: -2 - Math.random() * 2,
              radius: 10 + Math.random() * 20,
              alpha: 0.5,
              growth: 0.5
          });
      }

      for(let i=puffs.length-1; i>=0; i--) {
          const p = puffs[i];
          p.x += p.vx;
          p.y += p.vy;
          p.radius += p.growth;
          p.alpha -= 0.005;
          
          if(p.alpha <= 0) {
              puffs.splice(i, 1);
              continue;
          }
          
          ctx.beginPath();
          ctx.fillStyle = `rgba(200, 200, 200, ${p.alpha})`;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
      }

      requestAnimationFrame(animate);
    };
    
    const handleMove = (e: MouseEvent) => {
        puffs.push({
              x: e.clientX,
              y: e.clientY,
              vx: (Math.random() - 0.5) * 2,
              vy: -2 - Math.random() * 2,
              radius: 5 + Math.random() * 10,
              alpha: 0.5,
              growth: 0.5
        });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#333] -z-10" />;
}
