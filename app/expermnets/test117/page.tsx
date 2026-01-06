"use client";
import { useEffect, useRef } from "react";

export default function FractalTree() {
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

    let angleOffset = 0;
    
    const drawTree = (x: number, y: number, len: number, angle: number, branchWidth: number) => {
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        ctx.lineWidth = branchWidth;
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI/180);
        ctx.moveTo(0,0);
        ctx.lineTo(0, -len);
        ctx.stroke();
        
        if(len < 10) {
            ctx.restore();
            return;
        }
        
        const sway = Math.sin(Date.now() * 0.001 + x * 0.01) * 5;
        
        drawTree(0, -len, len * 0.75, angleOffset + sway + 15, branchWidth * 0.7);
        drawTree(0, -len, len * 0.75, -(angleOffset + sway + 15), branchWidth * 0.7);
        
        ctx.restore();
    }

    const animate = () => {
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, width, height);
      
      angleOffset = 25 + Math.sin(Date.now() * 0.0005) * 10;
      
      drawTree(width/2, height, 150, 0, 20);
      
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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#111] -z-10" />;
}
