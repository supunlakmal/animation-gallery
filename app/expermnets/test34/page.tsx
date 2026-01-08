"use client";

import { useEffect, useRef } from "react";

export default function FractalGrowth() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    mouseRef.current = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const drawBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
      if (depth === 0) return;

      const x2 = x + Math.cos(angle) * length;
      const y2 = y + Math.sin(angle) * length;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsla(${depth * 20 + 150}, 70%, 60%, ${depth / 10})`;
      ctx.lineWidth = depth;
      ctx.stroke();

      const mouseAngle = Math.atan2(mouseRef.current.y - y, mouseRef.current.x - x);
      const angleOffset = (mouseAngle - angle) * 0.1;

      drawBranch(x2, y2, length * 0.75, angle - 0.4 + angleOffset, depth - 1);
      drawBranch(x2, y2, length * 0.75, angle + 0.4 + angleOffset, depth - 1);
    };

    const animate = () => {
      ctx.fillStyle = "rgba(10, 20, 15, 0.2)";
      ctx.fillRect(0, 0, width, height);

      drawBranch(width / 2, height, 150, -Math.PI / 2, 10);
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-[#0a140f]" />;
}
