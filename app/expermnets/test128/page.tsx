"use client";
import { useEffect, useRef } from "react";

export default function LightningBolt() {
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

    const bolts: {x1: number, y1: number, x2: number, y2: number, alpha: number}[] = [];
    
    const createBolt = (x: number, y: number, targetX: number, targetY: number) => {
        // Recursive? Or simple segments
        const segments = 20;
        let cx = x;
        let cy = y;
        
        for(let i=0; i<segments; i++) {
            const t = (i+1) / segments;
            const tx = x + (targetX - x) * t;
            const ty = y + (targetY - y) * t;
            
            // Jitter
            const jx = (Math.random() - 0.5) * 100;
            const jy = (Math.random() - 0.5) * 100;
            
            const nx = (i === segments-1) ? targetX : tx + jx;
            const ny = (i === segments-1) ? targetY : ty + jy;
            
            bolts.push({x1: cx, y1: cy, x2: nx, y2: ny, alpha: 1});
            cx = nx;
            cy = ny;
        }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,10,0.2)"; // Slow fade for flash effect
      ctx.fillRect(0, 0, width, height);
      
      if (Math.random() > 0.95) {
          createBolt(Math.random() * width, 0, Math.random() * width, height);
      }
      
      for(let i=bolts.length-1; i>=0; i--) {
          const b = bolts[i];
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200, 200, 255, ${b.alpha})`;
          ctx.lineWidth = 2;
          ctx.moveTo(b.x1, b.y1);
          ctx.lineTo(b.x2, b.y2);
          ctx.stroke();
          
          b.alpha -= 0.1;
          if (b.alpha <= 0) bolts.splice(i, 1);
      }
      
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    const handleClick = (e: MouseEvent) => {
        createBolt(width/2, 0, e.clientX, e.clientY);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#000010] -z-10" />;
}
