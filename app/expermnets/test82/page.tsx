"use client";
import React, { useEffect, useRef } from "react";

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

    let time = 0;

    const animate = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      const rows = 20;
      const cols = 20;
      const cellW = width / cols;
      const cellH = height / rows;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * cellW + cellW / 2;
          const y = j * cellH + cellH / 2;
          
          const dist = Math.sqrt((x - width/2)**2 + (y - height/2)**2);
          const angle = dist * 0.01 + time;
          
          const size = (Math.sin(angle) + 1) * 0.5 * Math.min(cellW, cellH) * 0.8;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle * 0.5);
          
          ctx.beginPath();
          ctx.strokeStyle = `hsl(${angle * 50}, 60%, 60%)`;
          ctx.lineWidth = 2;
          ctx.moveTo(size, 0);
          ctx.lineTo(size * Math.cos(2*Math.PI/3), size * Math.sin(2*Math.PI/3));
          ctx.lineTo(size * Math.cos(4*Math.PI/3), size * Math.sin(4*Math.PI/3));
          ctx.closePath();
          ctx.stroke();
          
          ctx.restore();
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
