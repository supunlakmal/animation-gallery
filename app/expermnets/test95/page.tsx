"use client";
import React, { useEffect, useRef } from "react";

export default function HexagonGrid() {
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

    const hexSize = 30;
    const hexHeight = hexSize * 2;
    const hexWidth = Math.sqrt(3) * hexSize;
    const vertDist = hexHeight * 0.75;

    let time = 0;

    const drawHex = (x: number, y: number, color: string) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i + Math.PI / 6;
            const hx = x + Math.cos(angle) * hexSize;
            const hy = y + Math.sin(angle) * hexSize;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.strokeStyle = "#333";
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, width, height);

      const rows = Math.ceil(height / vertDist);
      const cols = Math.ceil(width / hexWidth);

      for (let r = 0; r < rows; r++) {
         for (let c = 0; c < cols; c++) {
             const x = c * hexWidth + (r % 2) * (hexWidth / 2);
             const y = r * vertDist;
             
             // Animated wave pattern
             const dist = Math.sqrt((x - width/2)**2 + (y - height/2)**2);
             const val = Math.sin(dist * 0.01 - time) * 0.5 + 0.5;
             const alpha = val * 0.8;
             
             const color = `rgba(0, 255, 200, ${alpha})`;
             drawHex(x, y, color);
         }
      }

      time += 0.05;
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
