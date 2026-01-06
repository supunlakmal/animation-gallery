"use client";
import { useEffect, useRef } from "react";

export default function SineScape() {
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
    
    let frame = 0;

    const animate = () => {
      ctx.fillStyle = "#100010";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "#d0f";
      ctx.lineWidth = 1;
      
      const cx = width / 2;
      const cy = height / 2;
      
      frame++;
      
      // Retro grid landscape
      // Horizon at cy
      
      for(let y=0; y<height/2; y+=20) {
          // Perspective transform
          // Lines get closer together as they go up to horizon
          const p = y / (height/2); // 0 at horizon, 1 at bottom
          // Avoid 0
          const z = 1 / (p + 0.01);
          
          const screenY = cy + p * (height/2);
          
          // Draw horizontal lines
          ctx.beginPath();
          // Bend them with sine
          for(let x=0; x<width; x+=20) {
               const offset = Math.sin(x * 0.01 + frame * 0.05 + z) * 20 * p;
               if (x===0) ctx.moveTo(x, screenY + offset);
               else ctx.lineTo(x, screenY + offset);
          }
          ctx.stroke();
      }
      
      // Vertical lines radiating
      for(let x=-width; x<width*2; x+=100) {
          ctx.beginPath();
          ctx.moveTo(x, height);
          ctx.lineTo(cx, cy); // Not quite right for perspective but okay for retro feel
          ctx.stroke();
      }

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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#100010] -z-10" />;
}
