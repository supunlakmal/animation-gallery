"use client";
import React, { useEffect, useRef } from "react";

export default function Metaballs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Blobs
  const blobs = useRef(
    Array.from({ length: 15 }, () => ({
      x: Math.random() * 500,
      y: Math.random() * 500,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      r: Math.random() * 30 + 40,
    }))
  );

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

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      // Background irrelevant to blobs if isolated, but we want a color
      ctx.fillStyle = "#fff";
      // ctx.fillRect(0,0,width,height); // relying on CSS background instead

      // Move Blobs
      blobs.current.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < 0 || b.x > width) b.vx *= -1;
        if (b.y < 0 || b.y > height) b.vy *= -1;

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "black"; // Black blobs for contrast filter
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-white">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          filter: "blur(20px) contrast(30)",
          // This creates the gooey effect: Blur mixes pixels, contrast sharpens the gradient back to hard edge
        }}
      />
    </div>
  );
}
