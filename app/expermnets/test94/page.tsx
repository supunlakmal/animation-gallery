"use client";
import React, { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise2D = createNoise2D(Math.random);

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
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, width, height);

      const bars = 64;
      const barWidth = width / bars;
      
      const cx = width / 2;
      const cy = height / 2;
      const radius = 100;

      for (let i = 0; i < bars; i++) {
        // Simulating frequency data with noise
        const n = (noise2D(i * 0.1, time) + 1) / 2; // 0 to 1
        const barHeight = n * 200 + 50;
        
        // Circular visualizer looks cooler
        const angle = (i / bars) * Math.PI * 2;
        
        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + Math.sin(angle) * radius;
        const x2 = cx + Math.cos(angle) * (radius + barHeight);
        const y2 = cy + Math.sin(angle) * (radius + barHeight);

        ctx.beginPath();
        ctx.strokeStyle = `hsl(${i / bars * 360 + time * 50}, 100%, 50%)`;
        ctx.lineWidth = 4;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
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
    const frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />;
}
