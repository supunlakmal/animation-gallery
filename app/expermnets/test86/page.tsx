"use client";
import React, { useEffect, useRef } from "react";

export default function HypnoticSpirals() {
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
      // Trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.sqrt(cx**2 + cy**2);

      ctx.save();
      ctx.translate(cx, cy);

      const count = 50;
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const angle = time * (1 + t) + t * Math.PI * 4;
        const radius = t * maxRadius;
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        ctx.beginPath();
        const hue = (time * 50 + t * 360) % 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.arc(x, y, 5 + t * 20, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();

      time += 0.02;
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
