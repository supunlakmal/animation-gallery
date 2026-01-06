"use client";
import { useEffect, useRef } from "react";

export default function LissajousCurves() {
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
    const cellW = 80;
    const cols = Math.floor(width / cellW);
    const rows = Math.floor(height / cellW);

    const animate = () => {
      // Fade out
      ctx.fillStyle = "rgba(0,0,0,0.02)";
      ctx.fillRect(0,0,width,height);
      
      ctx.lineWidth = 1;
      
      for(let i=0; i<cols; i++) {
          for(let j=0; j<rows; j++) {
              const cx = i * cellW + cellW/2;
              const cy = j * cellW + cellW/2;
              const r = cellW/2 - 5;
              
              // x determined by col i, y by row j
              // Frequencies depend on i and j
              const fx = i + 1;
              const fy = j + 1;
              
              const x = cx + Math.cos(angle * fx) * r * 0.4; // Local coords? No, this is wrong for classic table.
              
              // Classic table:
              // Top row defines X for column
              // Left col defines Y for row
              
              // Let's just do random lissajous in grid
              const px = cx + Math.sin(angle * fx) * r;
              const py = cy + Math.cos(angle * fy) * r;
              
              ctx.beginPath();
              ctx.fillStyle = `hsl(${(i+j)*20}, 70%, 50%)`;
              ctx.arc(px, py, 2, 0, Math.PI*2);
              ctx.fill();
          }
      }

      angle += 0.01;
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = "black";
      ctx.fillRect(0,0,width,height);
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
