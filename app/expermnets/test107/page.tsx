"use client";
import { useEffect, useRef } from "react";

export default function AudioPulse() {
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
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Simulated beat
      const beat = Math.sin(time * 0.2) * Math.sin(time * 0.2) * Math.sin(time * 0.2) * 50;
      
      const count = 20;
      for (let i = 0; i < count; i++) {
        const radius = i * 20 + beat;
        if (radius > 0) {
            ctx.beginPath();
            ctx.strokeStyle = `hsl(${(time * 10 + i * 10) % 360}, 50%, 50%)`;
            ctx.lineWidth = 2;
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
      }
      
      // Rotating bars
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.01);
      
      for(let i=0; i<360; i+=10) {
          const rad = i * Math.PI / 180;
          const len = 50 + Math.random() * beat;
          ctx.strokeStyle = `hsl(${i}, 60%, 50%)`;
          ctx.beginPath();
          ctx.moveTo(Math.cos(rad) * 100, Math.sin(rad) * 100);
          ctx.lineTo(Math.cos(rad) * (100 + len), Math.sin(rad) * (100 + len));
          ctx.stroke();
      }
      
      ctx.restore();

      time++;
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
