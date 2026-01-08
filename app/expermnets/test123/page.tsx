"use client";
import { useEffect, useRef } from "react";

export default function Tunnel() {
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

    let z = 0;
    
    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      const cx = width/2;
      const cy = height/2;
      
      z += 2;
      if (z > 200) z -= 200;
      
      ctx.lineWidth = 2;
      
      for(let i=0; i<20; i++) {
          const dist = (i * 200 + z) % 4000;
          if (dist < 10) continue;
          
          const size = 10000 / dist;
          // Fade in from center
          const opacity = Math.min(1, size / 100); 

          ctx.strokeStyle = `rgba(0, 255, 128, ${opacity})`;
          ctx.strokeRect(cx - size/2, cy - size/2, size, size);
          
          // Fill diagonals
          if (i % 2 === 0) {
              ctx.beginPath();
              ctx.moveTo(0,0);
              ctx.lineTo(cx, cy);
              ctx.moveTo(width, 0);
              ctx.lineTo(cx, cy);
              ctx.moveTo(0, height);
              ctx.lineTo(cx, cy);
              ctx.moveTo(width, height);
              ctx.lineTo(cx, cy);
              ctx.stroke();
          }
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
