"use client";
import { useEffect, useRef } from "react";

export default function HypnoticSpirals() {
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

    let time = 0;

    const animate = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      
      time += 0.02;

      for(let i=0; i<3; i++) {
          // Draw spirals
          ctx.beginPath();
          ctx.strokeStyle = i === 0 ? "black" : (i===1 ? "red" : "blue");
          ctx.lineWidth = 2;
          
          const maxRadius = Math.max(width, height);
          const orientation = i % 2 === 0 ? 1 : -1;
          
          for(let r=0; r<maxRadius; r+=5) {
               const angle = r * 0.1 * orientation + time * (i+1);
               const x = cx + Math.cos(angle) * r;
               const y = cy + Math.sin(angle) * r;
               
               if(r===0) ctx.moveTo(x, y);
               else ctx.lineTo(x, y);
          }
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-white -z-10" />;
}
