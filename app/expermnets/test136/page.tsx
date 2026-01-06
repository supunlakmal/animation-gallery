"use client";
import { useEffect, useRef } from "react";

export default function Snowfall() {
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

    interface Flake {
        x: number;
        y: number;
        z: number; // For parallax speed
        radius: number;
        drift: number;
    }
    
    let flakes: Flake[] = [];
    
    const init = () => {
        flakes = [];
        for(let i=0; i<200; i++) {
            flakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * 2 + 0.5,
                radius: Math.random() * 2 + 1,
                drift: Math.random() * Math.PI * 2
            });
        }
    };
    
    init();

    const animate = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#000020");
      gradient.addColorStop(1, "#101030");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "white";
      
      flakes.forEach(f => {
          f.y += f.z; // Gravity
          f.x += Math.sin(f.drift) * 0.5; // Wind
          f.drift += 0.01;
          
          if(f.y > height) {
              f.y = -5;
              f.x = Math.random() * width;
          }
          if (f.x > width) f.x = 0;
          if (f.x < 0) f.x = width;
          
          ctx.beginPath();
          ctx.globalAlpha = f.z / 3;
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();
      });
      ctx.globalAlpha = 1;

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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-[#000020] -z-10" />;
}
