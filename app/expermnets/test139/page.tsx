"use client";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export default function Aurora() {
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
    
    const noise3D = createNoise3D();
    let time = 0;

    const animate = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#000"); // Starry night top
      gradient.addColorStop(1, "#0a0a2a"); // Horizon
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      time += 0.005;
      
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = 2;
      
      const lines = 50;
      
      for(let i=0; i<lines; i++) {
          ctx.beginPath();
          const xOffset = i * 20;
          ctx.strokeStyle = `hsla(${120 + i * 2}, 80%, 50%, 0.1)`; // Green/Blue aurora
          
          for(let y=0; y<height; y+=10) {
              const noise = noise3D(xOffset * 0.002, y * 0.002, time);
              const x = xOffset + noise * 200 + width/4; 
              
              if(y===0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          }
          ctx.stroke();
      }
      
      ctx.globalCompositeOperation = 'source-over';

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
