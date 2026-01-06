"use client";
import { useEffect, useRef } from "react";

export default function RippleEffect() {
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
    
    interface Ripple {
        x: number;
        y: number;
        radius: number;
        opacity: number;
        color: string;
    }
    
    let ripples: Ripple[] = [];
    
    const animate = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      
      // Add random ripples occasionally
      if (Math.random() > 0.95) {
          ripples.push({
              x: Math.random() * width,
              y: Math.random() * height,
              radius: 0,
              opacity: 1,
              color: `hsl(${Math.random() * 360}, 50%, 50%)`
          });
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += 2;
          r.opacity -= 0.01;
          
          if (r.opacity <= 0) {
              ripples.splice(i, 1);
              continue;
          }
          
          ctx.beginPath();
          ctx.strokeStyle = r.color.replace(')', `, ${r.opacity})`).replace('hsl', 'hsla');
          ctx.lineWidth = 3;
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.stroke();
      }

      requestAnimationFrame(animate);
    };
    
    const handleClick = (e: MouseEvent) => {
        ripples.push({
            x: e.clientX,
            y: e.clientY,
            radius: 0,
            opacity: 1,
            color: "#FFF"
        });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);
    const id = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black -z-10" />;
}
