"use client";
import React, { useEffect, useRef } from "react";

export default function AudioVisualizerConfig() {
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

    const bars = 64;
    const barValues = new Array(bars).fill(0);

    const animate = () => {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, width, height);

      // Simulate frequency data update
      for (let i = 0; i < bars; i++) {
        barValues[i] = barValues[i] * 0.9 + Math.random() * 50; // Smooth random
      }

      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const h = barValues[i] * 4;
        const x = i * barWidth;

        const hue = (i / bars) * 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        
        // Mirror effect
        ctx.fillRect(x, height/2, barWidth - 2, h/2);
        ctx.fillStyle = `hsl(${hue}, 100%, 30%)`; // Darker reflection
        ctx.fillRect(x, height/2, barWidth - 2, -h/2);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-black"
    />
  );
}
