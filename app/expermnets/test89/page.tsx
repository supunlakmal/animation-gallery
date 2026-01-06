"use client";
import React, { useEffect, useRef } from "react";

export default function FractalTrees() {
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

    let sway = 0;

    const drawBranch = (x: number, y: number, len: number, angle: number, width: number) => {
      ctx.beginPath();
      ctx.save();
      
      ctx.strokeStyle = `hsl(30, ${len}%, ${80 - len/2}%)`; // Brown to green-ish
      ctx.lineWidth = width;
      ctx.translate(x, y);
      ctx.rotate(angle * Math.PI/180);
      
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -len);
      ctx.stroke();

      if (len < 10) {
        ctx.restore();
        return;
      }

      ctx.translate(0, -len);

      drawBranch(0, 0, len * 0.75, 25 + sway, width * 0.7);
      drawBranch(0, 0, len * 0.75, -25 + sway, width * 0.7);

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#E0F7FA");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.001;
      sway = Math.sin(time) * 5;

      drawBranch(width / 2, height, 150, 0, 20);

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
