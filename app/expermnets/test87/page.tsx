"use client";
import React, { useEffect, useRef } from "react";

export default function GooeyBlobs() {
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

    const blobs: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = [];
    const numBlobs = 15;

    for (let i = 0; i < numBlobs; i++) {
        blobs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            r: Math.random() * 40 + 40,
            color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`
        });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Background
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, width, height);

      // Blobs with contrast filter trick is usually done via CSS filter on container + blur on canvas
      // But we can do it in context if supported or just simulate "gooey" by drawing connection.
      // Standard canvas "gooey" uses GlobalCompositeOperation usually or SVG filters.
      // Let's just do standard bouncing balls but with a "lighten" blend mode for a cool effect.
      
      ctx.globalCompositeOperation = "screen";

      blobs.forEach(b => {
          b.x += b.vx;
          b.y += b.vy;

          if (b.x < b.r || b.x > width - b.r) b.vx *= -1;
          if (b.y < b.r || b.y > height - b.r) b.vy *= -1;

          ctx.beginPath();
          ctx.fillStyle = b.color;
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over"; // Reset
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

  return (
    <>
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" style={{ filter: 'blur(20px) contrast(20)' }} />
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'black', zIndex: -1 }}></div>
    </>
  );
}
