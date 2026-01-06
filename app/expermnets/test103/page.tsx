"use client";
import { useEffect, useRef } from "react";

export default function GeometricWaves() {
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

    let angle = 0;

    const animate = () => {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      // Zoom out a bit
      ctx.scale(1, 0.6); 
      // Rotate entire scene slowly
      ctx.rotate(angle * 0.2);

      const gridSize = 30;
      const spacing = 40;
      const waveSpeed = 0.05;

      for (let x = -gridSize / 2; x < gridSize / 2; x++) {
        for (let y = -gridSize / 2; y < gridSize / 2; y++) {
          const dist = Math.sqrt(x * x + y * y);
          // Calculate height based on sine wave from center
          const z = Math.sin(dist * 0.5 - angle) * 100;
          
          // Color based on height
          const hue = (z + 100) * 1.5;
          ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;

          // Draw block
          const size = 20;
          const mapX = x * spacing;
          const mapY = y * spacing; // Isomertic-ish projection logic could go here, but top-down is fine for this abstract look
          
          // Simple perspective projection fake
          // We just draw rectangles sized by 'z' to look like pillars?
          // Or just squares changing size/color?
          // Let's do changing size
          const scale = (z + 150) / 250; 
          ctx.fillStyle = `hsl(${hue}, 60%, 60%)`;
          ctx.fillRect(mapX, mapY, size * scale, size * scale);
        }
      }

      ctx.restore();
      angle += waveSpeed;
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#1a1a1a] -z-10" />;
}
