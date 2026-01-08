"use client";
import { useEffect, useRef } from "react";

export default function LiquidChrome() {
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
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#c0c0c0");
      gradient.addColorStop(0.5, "#e0e0e0");
      gradient.addColorStop(1, "#a0a0a0");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Let's try a different approach: Metaballs-ish gradient fill
      // Or just many overlapping sine waves creating interference that looks like liquid metal
      
      for(let i=0; i<width; i+=40) {
          for(let j=0; j<height; j+=40) {
              const dist = Math.sqrt((i - width/2)**2 + (j - height/2)**2);
              const offset = Math.sin(dist * 0.02 - time) * 30;
              const radius = 20 + Math.sin(i * 0.05 + time) * 10 + Math.cos(j * 0.05 + time) * 10;
              
              ctx.fillStyle = `rgba(180, 180, 180, 0.5)`;
              ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
              
              const x = i + offset;
              const y = j + offset;
              
              ctx.beginPath();
              ctx.arc(x, y, Math.abs(radius), 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
          }
      }

      time += 0.05;
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-gray-300 -z-10" />;
}
