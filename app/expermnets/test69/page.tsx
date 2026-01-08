"use client";
import React, { useEffect, useRef } from "react";

export default function MoirePatterns() {
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
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);

      const t = time * 0.001;

      // Layer 1
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(t * 0.1);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 150; i += 5) {
        ctx.beginPath();
        ctx.arc(i/4, 0, i * 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Layer 2
      ctx.save();
      ctx.translate(width / 2 + Math.sin(t) * 50, height / 2 + Math.cos(t) * 50);
      ctx.rotate(-t * 0.15);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
      ctx.lineWidth = 2;

      for (let i = 0; i < 150; i += 5) {
        ctx.beginPath();
        ctx.arc(0, 0, i * 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

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
