"use client";
import React, { useEffect, useRef } from "react";
import Delaunator from "delaunator";

export default function DelaunayAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Points
  interface Point {
    x: number; 
    y: number;
    vx: number;
    vy: number;
  }
  
  const pointsRef = useRef<Point[]>([]);

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

    // Init Points
    const count = 100;
    pointsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, width, height);

      const points = pointsRef.current;
      
      // Update points
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      // Delaunator
      // Must map to [x, y] format
      const coords = new Float64Array(points.length * 2);
      for (let i = 0; i < points.length; i++) {
        coords[2 * i] = points[i].x;
        coords[2 * i + 1] = points[i].y;
      }

      const delaunay = new Delaunator(coords);
      const triangles = delaunay.triangles;

      for (let i = 0; i < triangles.length; i += 3) {
        const i0 = triangles[i];
        const i1 = triangles[i + 1];
        const i2 = triangles[i + 2];
        
        const p0 = points[i0];
        const p1 = points[i1];
        const p2 = points[i2];

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        
        // Color based on position
        const cx = (p0.x + p1.x + p2.x) / 3;
        const cy = (p0.y + p1.y + p2.y) / 3;
        
        const hue = (cx / width) * 360;
        const sat = 50 + (cy / height) * 50;
        
        ctx.fillStyle = `hsla(${hue}, ${sat}%, 50%, 0.2)`;
        ctx.strokeStyle = `hsla(${hue}, ${sat}%, 70%, 0.3)`;
        ctx.fill();
        ctx.stroke();
      }

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
