"use client";
import React, { useEffect, useRef } from "react";

export default function HypnoticSpiral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

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
      ctx.clearRect(0, 0, width, height); // No trails, crisp
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);

      const t = time * 0.002;
      const center = { x: width / 2, y: height / 2 };
      
      ctx.fillStyle = "#000";
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(t);
      
      const maxRadius = Math.max(width, height) * 0.8;
      
      // Draw Archimedean spiral strip
      // Actually easier to just draw lines or arc segments
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.beginPath();
      
      for (let angle = 0; angle < 100; angle += 0.1) {
          const r = 10 * angle;
          if (r > maxRadius) break;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Another intertwined spiral
      ctx.rotate(Math.PI);
      ctx.beginPath();
      for (let angle = 0; angle < 100; angle += 0.1) {
          const r = 10 * angle;
          if (r > maxRadius) break;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.restore();

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
