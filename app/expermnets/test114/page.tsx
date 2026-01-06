"use client";
import { useEffect, useRef } from "react";

export default function StarWarp() {
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

    interface Star {
        x: number;
        y: number;
        z: number;
        color: string;
    }
    
    let stars: Star[] = [];
    const count = 400;
    
    for(let i=0; i<count; i++) {
        stars.push({
            x: (Math.random() - 0.5) * width,
            y: (Math.random() - 0.5) * height,
            z: Math.random() * width,
            color: `hsl(${Math.random() * 360}, 80%, 80%)`
        });
    }

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      
      stars.forEach(star => {
         star.z -= 10; // Speed
         
         if (star.z <= 0) {
             star.z = width;
             star.x = (Math.random() - 0.5) * width;
             star.y = (Math.random() - 0.5) * height;
         }
         
         const k = 128.0 / star.z;
         const px = star.x * k + cx;
         const py = star.y * k + cy;
         
         if (px >= 0 && px <= width && py >= 0 && py <= height) {
             const size = (1 - star.z / width) * 4;
             ctx.beginPath();
             ctx.fillStyle = star.color;
             ctx.arc(px, py, size, 0, Math.PI * 2);
             ctx.fill();
         }
      });

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
