"use client";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export default function HexagonGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const noise3D = createNoise3D(Math.random);

  // Hex helpers
  const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
  };

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

    const radius = 30; // Hex radius
    const a = 2 * Math.PI / 6;
    const r = radius; 
    const w = Math.sqrt(3) * r; // Width of hex
    const h = 2 * r; // Height of hex
    const hShift = w;
    const vShift = h * 0.75;


    const animate = (time: number) => {
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, width, height);

      const t = time * 0.0005;

      const cols = Math.ceil(width / w) + 1;
      const rows = Math.ceil(height / vShift) + 1;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * w + (row % 2) * (w / 2);
            const y = row * vShift;
            
            // Noise 
            const n = noise3D(col * 0.1, row * 0.1, t);
            const scale = (n + 1) / 2; // 0 to 1

            const currentR = radius * scale * 0.9;
            
            const hue = 200 + n * 100;

            ctx.fillStyle = `hsl(${hue}, 60%, ${30 + scale * 40}%)`;
            // ctx.strokeStyle = `hsl(${hue}, 60%, 50%)`;
            
            drawHex(ctx, x, y, currentR);
            ctx.fill();
            // ctx.stroke();
        }
      }

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
