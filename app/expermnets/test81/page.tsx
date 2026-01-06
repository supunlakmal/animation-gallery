"use client";
import React, { useEffect, useRef } from "react";

export default function FluidGrid() {
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

    const gap = 30;
    const points: { x: number; y: number; ox: number; oy: number }[] = [];

    const initPoints = () => {
      points.length = 0;
      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          points.push({ x, y, ox: x, oy: y });
        }
      }
    };
    initPoints();

    const mouse = { x: -1000, y: -1000 };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, width, height);

      points.forEach((p) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        if (dist < maxDist) {
          const angle = Math.atan2(dy, dx);
          const force = (maxDist - dist) / maxDist;
          const moveX = Math.cos(angle) * force * 50; // Repel force
          const moveY = Math.sin(angle) * force * 50;
          
          p.x -= moveX * 0.1;
          p.y -= moveY * 0.1;
        }

        // Return to original pos
        p.x += (p.ox - p.x) * 0.05;
        p.y += (p.oy - p.y) * 0.05;

        ctx.beginPath();
        ctx.fillStyle = `hsl(${(p.x / width) * 360}, 70%, 50%)`;
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initPoints();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    const frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />;
}
