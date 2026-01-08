"use client";
import { useEffect, useRef } from "react";

export default function HypnoticSpirals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let angle = 0;

    const animate = () => {
        // Trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(angle);
      
      // Draw spinning shapes
      const numShapes = 20;
      
      for(let i=0; i<numShapes; i++) {
        // Each shape rotates a bit differently
        // Golden angle offset
        ctx.beginPath();
        ctx.rotate(i * 0.1 + angle * 0.05);
        ctx.lineWidth = 2;
        
        const r = i * (255/numShapes);
        const g = 255 - i * (255/numShapes) / 2;
        const b = 255;
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        
        const radius = i * 20 + Math.sin(angle * 2 + i) * 20;

        // Draw a polygon or circle
        // Let's draw squares
        const rectSize = radius;
        ctx.rect(-rectSize/2, -rectSize/2, rectSize, rectSize);
        ctx.stroke();
      }

      ctx.restore();
      angle += 0.01;
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 bg-black" />;
}
