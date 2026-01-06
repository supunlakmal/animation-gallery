"use client";
import { useEffect, useRef } from "react";

export default function GravityGrid() {
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

    let mouse = { x: width/2, y: height/2 };

    const animate = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);

      const spacing = 40;
      
      for(let x=0; x < width; x+=spacing) {
          for(let y=0; y < height; y+=spacing) {
              const dx = mouse.x - x;
              const dy = mouse.y - y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              
              const force = Math.max(0, 150 - dist) / 150;
              const angle = Math.atan2(dy, dx);
              
              const drawX = x + Math.cos(angle) * force * -50; // Push away
              const drawY = y + Math.sin(angle) * force * -50;
              
              const size = 2 + force * 5;
              
              ctx.beginPath();
              ctx.fillStyle = `rgba(0,0,0, ${0.2 + force * 0.8})`;
              ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
              ctx.fill();
          }
      }

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-white -z-10" />;
}
