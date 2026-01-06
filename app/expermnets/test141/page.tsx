"use client";

import { useEffect, useRef } from "react";

export default function NeonPulseGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    const gridSize = 40;
    const gap = 2;
    let cols = Math.ceil(width / gridSize);
    let rows = Math.ceil(height / gridSize);

    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.ceil(width / gridSize);
      rows = Math.ceil(height / gridSize);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const animate = () => {
      time += 0.05;
      
      // Clear
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;
          const cx = x + gridSize / 2;
          const cy = y + gridSize / 2;

          // Distance from mouse
          const dx = mouse.x - cx;
          const dy = mouse.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Wave effect
          const wave = Math.sin(time + (i + j) * 0.2) * 0.5 + 0.5;
          
          // Interaction
          const active = Math.max(0, 1 - dist / 300);
          
          const scale = 0.8 + active * 0.4 + wave * 0.1;
          const size = (gridSize - gap) * scale;
          
          const hue = (time * 10 + (i + j) * 2) % 360;
          const saturation = 70 + active * 30;
          const lightness = 20 + active * 40 + wave * 10;
          const alpha = 0.5 + active * 0.5;

          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          
          // Draw rect centered
          ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#050505]" />;
}
