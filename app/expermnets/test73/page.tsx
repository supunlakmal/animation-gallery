"use client";
import React, { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export default function Aurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const noise2D = createNoise2D(Math.random);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.filter = "blur(30px)"; // Heavy blur for aurora look
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = (time: number) => {
      ctx.fillStyle = "rgba(0, 0, 20, 0.4)"; // Deep dark fade
      ctx.fillRect(0, 0, width, height);
      
      const t = time * 0.0005;

      for (let i = 0; i < 3; i++) {
        // Draw 3 ribbons
        ctx.beginPath();
        for (let x = 0; x < width; x += 10) {
           const y = height / 2 
                     + noise2D(x * 0.002, t + i) * 200 
                     + Math.sin(x * 0.01 + t) * 50;
           
           if (x === 0) ctx.moveTo(x, y);
           else ctx.lineTo(x, y);
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `hsla(${120 + i * 40}, 80%, 60%, 0.3)`);
        gradient.addColorStop(1, `hsla(${180 + i * 40}, 80%, 60%, 0.1)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Highlight line
        ctx.lineWidth = 2;
        ctx.strokeStyle = `hsla(${120 + i * 40}, 100%, 80%, 0.5)`;
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    // Intentionally run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-[#000014]"
    />
  );
}
