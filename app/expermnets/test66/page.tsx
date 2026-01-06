"use client";
import React, { useEffect, useRef } from "react";

export default function SierpinskiZoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let zoom = 1;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const drawTriangle = (x: number, y: number, r: number) => {
      // Don't draw if too small
      if (r < 5) return;

      // Check bounds
      if (x + r < 0 || x - r > width || y + r < 0 || y - r > height) return;

      // Draw
      ctx.strokeStyle = `hsl(${(x + y) * 0.1 + zoom * 10}, 70%, 50%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Triangle calculations
      const h = r * Math.sqrt(3) / 2;
      ctx.moveTo(x, y - h);
      ctx.lineTo(x - r / 2, y + h / 2);
      ctx.lineTo(x + r / 2, y + h / 2);
      ctx.closePath();
      ctx.stroke();

      // Recursive calls (Inverted Sierpinski logic for interesting look)
      // Actually let's just draw the gasket
      // Top
      drawTriangle(x, y - h / 2, r / 2);
      // Left
      drawTriangle(x - r / 4, y + h / 4, r / 2);
      // Right
      drawTriangle(x + r / 4, y + h / 4, r / 2);
    };

    const animate = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      zoom *= 1.01;
      if (zoom > 4) zoom = 2; // Loop logic isn't perfect for infinite zoom without more complex resets, 
                              // so let's just make it a pulsating fractal or simple fractal with rotation

      // Simple recursive fractal
      const t = Date.now() * 0.001;
      
      const drawFractal = (x:number, y:number, size:number, depth:number) => {
        if (depth === 0) return;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 0.2 * (depth % 2 === 0 ? 1 : -1));
        
        ctx.strokeStyle = `hsl(${depth * 40}, 80%, 60%)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(-size/2, -size/2, size, size);
        
        // Children
        const newSize = size * 0.6;
        drawFractal(-size/2, -size/2, newSize, depth - 1);
        drawFractal(size/2, size/2, newSize, depth - 1);
        drawFractal(-size/2, size/2, newSize, depth - 1);
        drawFractal(size/2, -size/2, newSize, depth - 1);
        
        ctx.restore();
      };

      drawFractal(width/2, height/2, 200 + Math.sin(t)*50, 5);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

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
