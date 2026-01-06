"use client";

import { useEffect, useRef } from "react";

export default function CyberGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = (time: number) => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      const gridSize = 40;
      const t = time * 0.001;

      ctx.strokeStyle = "#0ff3";
      ctx.lineWidth = 1;

      // Perspective transformation
      const vanishX = width / 2;
      const vanishY = height * 0.3;

      for (let i = -20; i <= 20; i++) {
        // Horizontal lines (moving towards viewer)
        const zOffset = (t * 50) % gridSize;
        for (let j = 0; j < 30; j++) {
            const z = j * gridSize - zOffset;
            const y = vanishY + (height - vanishY) * (z / height);
            const scale = (y - vanishY) / (height - vanishY);
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Vertical lines (convergance to vanishing point)
        const x = vanishX + i * gridSize * 4;
        ctx.beginPath();
        ctx.moveTo(vanishX + (x - vanishX) * 0.1, vanishY);
        ctx.lineTo(vanishX + (x - vanishX) * 10, height);
        ctx.stroke();
      }

      // Add a glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#0ff";
      
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-black" />;
}
