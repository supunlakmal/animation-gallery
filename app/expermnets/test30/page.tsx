"use client";

import { useEffect, useRef } from "react";

export default function GeometricKaleidoscope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

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

    const drawHexagon = (x: number, y: number, size: number, angle: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const px = size * Math.cos((i * Math.PI) / 3);
        const py = size * Math.sin((i * Math.PI) / 3);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);
      
      timeRef.current += 0.01;
      const t = timeRef.current;

      const centerX = width / 2;
      const centerY = height / 2;
      const count = 12;

      for (let i = 0; i < count; i++) {
        const orbitAngle = (i / count) * Math.PI * 2 + t * 0.2;
        const radius = 200 + Math.sin(t) * 100;
        const x = centerX + Math.cos(orbitAngle) * radius;
        const y = centerY + Math.sin(orbitAngle) * radius;
        
        const hue = (i * 30 + t * 50) % 360;
        drawHexagon(x, y, 50, t + i, `hsla(${hue}, 80%, 60%, 0.8)`);
      }

      // Center shape
      drawHexagon(centerX, centerY, 100, -t, `hsla(${(t * 50) % 360}, 100%, 70%, 1)`);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-black" />;
}
