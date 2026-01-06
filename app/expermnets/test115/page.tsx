"use client";
import { useEffect, useRef } from "react";

export default function SoftBody() {
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

    const points: {x: number, y: number, vx: number, vy: number}[] = [];
    const radius = 150;
    const centerX = width / 2;
    const centerY = height / 2;
    const numPoints = 20;

    for(let i=0; i<numPoints; i++) {
        const angle = i / numPoints * Math.PI * 2;
        points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            vx: 0,
            vy: 0
        });
    }

    // Spring logic
    const k = 0.1; // Spring constant
    const damping = 0.9;

    const animate = () => {
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, width, height);

      // Target shape is circle
      for(let i=0; i<numPoints; i++) {
          const angle = i / numPoints * Math.PI * 2;
          const targetX = width/2 + Math.cos(angle) * radius;
          const targetY = height/2 + Math.sin(angle) * radius;

          // Spring force towards target
          const fx = (targetX - points[i].x) * k;
          const fy = (targetY - points[i].y) * k;

          points[i].vx += fx;
          points[i].vy += fy;
          
          points[i].vx *= damping;
          points[i].vy *= damping;
          
          points[i].x += points[i].vx;
          points[i].y += points[i].vy;
      }
      
      // Draw blob
      ctx.beginPath();
      // Curve through points
      ctx.fillStyle = "#00d2ff";
      ctx.moveTo(points[0].x, points[0].y);
      for(let i=1; i<=numPoints; i++) {
          const p = points[i % numPoints];
          const nextP = points[(i+1)%numPoints]; // Use midpoints for smooth curve?
          // Simple line to
          ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fill();

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    // Interaction: distort points
    const handleMouseDown = (e: MouseEvent) => {
        points.forEach(p => {
            p.vx += (Math.random() - 0.5) * 50;
            p.vy += (Math.random() - 0.5) * 50;
        });
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#222] -z-10" />;
}
