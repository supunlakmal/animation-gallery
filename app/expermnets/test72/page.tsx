"use client";
import React, { useEffect, useRef } from "react";

export default function WaveInterference() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

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
    };
    window.addEventListener("resize", resize);

    const cols = 50;
    const rows = 30;
    
    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#111"; // BG
      ctx.fillRect(0, 0, width, height);

      const t = time * 0.002;
      
      const gapX = width / cols;
      const gapY = height / rows;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * gapX + gapX / 2;
          const py = y * gapY + gapY / 2;

          // Interference of 2 waves
          const d1 = Math.sqrt((px - width * 0.3) ** 2 + (py - height * 0.5) ** 2);
          const d2 = Math.sqrt((px - width * 0.7) ** 2 + (py - height * 0.5) ** 2);

          const val1 = Math.sin(d1 * 0.05 - t);
          const val2 = Math.sin(d2 * 0.05 - t);
          const val = (val1 + val2) / 2; // -1 to 1

          const r = (val + 1) * 5; // Radius 0 to 10
          
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${200 + val * 50}, 80%, 60%)`;
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
    />
  );
}
