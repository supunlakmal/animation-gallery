"use client";
import { useEffect, useRef } from "react";

export default function DNAHelix() {
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
    
    // 3D projection helper
    const project = (x: number, y: number, z: number) => {
        const scale = 300 / (300 + z);
        const px = width/2 + x * scale;
        const py = height/2 + y * scale;
        return { x: px, y: py, scale };
    };

    const animate = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      time += 0.05;
      
      const pointsPerStrand = 40;
      const spacing = 20;
      const radius = 100;
      
      for(let i=0; i<pointsPerStrand; i++) {
          const y = (i - pointsPerStrand/2) * spacing;
          const angle = i * 0.5 + time;
          
          const x1 = Math.cos(angle) * radius;
          const z1 = Math.sin(angle) * radius;
          
          const x2 = Math.cos(angle + Math.PI) * radius;
          const z2 = Math.sin(angle + Math.PI) * radius;
          
          const p1 = project(x1, y, z1);
          const p2 = project(x2, y, z2);
          
          // Draw connection
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          
          // Draw balls
          const alpha1 = (z1 + radius) / (2*radius); // Depth cue
          const alpha2 = (z2 + radius) / (2*radius);
          
          ctx.beginPath();
          ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + alpha1*0.5})`;
          ctx.arc(p1.x, p1.y, 5 * p1.scale, 0, Math.PI*2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 0, 255, ${0.5 + alpha2*0.5})`;
          ctx.arc(p2.x, p2.y, 5 * p2.scale, 0, Math.PI*2);
          ctx.fill();
      }

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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
