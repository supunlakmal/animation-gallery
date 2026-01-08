"use client";
import React, { useEffect, useRef } from "react";

export default function BreathingCircles() {
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

    const animate = (time: number) => {
      // Clear with trail? No, clean abstract look.
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#F0F4F8"; // Off-white
      ctx.fillRect(0, 0, width, height);

      const t = time * 0.001;
      const layers = 5;

      for (let i = 0; i < layers; i++) {
        const offset = i * 0.5;
        const radius = 100 + Math.sin(t + offset) * 50 + i * 40;
        const alpha = 0.3 - i * 0.05;
        
        ctx.fillStyle = `rgba(100, 150, 255, ${alpha})`;
        // Simulate blur by drawing multiple concentric
        // Or simpler: just use ShadowBlur
        ctx.shadowBlur = 40;
        ctx.shadowColor = "rgba(100, 150, 255, 0.5)";
        
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
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
