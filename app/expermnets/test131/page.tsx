"use client";
import { useEffect, useRef } from "react";

export default function RetrowaveGrid() {
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

    const animate = () => {
      // Sky
      const gradient = ctx.createLinearGradient(0, 0, 0, height/2);
      gradient.addColorStop(0, "#0f0c29");
      gradient.addColorStop(1, "#302b63");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height/2);
      
      // Ground
      ctx.fillStyle = "#111";
      ctx.fillRect(0, height/2, width, height/2);
      
      // Sun
      const sunY = height/2 - 50;
      const sunGradient = ctx.createLinearGradient(0, sunY - 100, 0, sunY + 100);
      sunGradient.addColorStop(0, "#FDB813");
      sunGradient.addColorStop(1, "#F27121");
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(width/2, sunY, 100, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun stripes
      for(let i=0; i<10; i++) {
          ctx.fillStyle = `rgba(15, 12, 41, ${i * 0.1})`;
          ctx.fillRect(width/2 - 110, sunY + i * 10, 220, 5);
      }
      
      // Grid
      ctx.strokeStyle = "#F27121";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Vertical lines fan out
      const focalX = width/2;
      const focalY = height/2; // Horizon
      
      // Horizontal moving lines
      time += 2;
      const offset = time % 40;
      
      // Draw horizontal lines with perspective spacing
      // y = H/2 + d / z
      for(let z=10; z<500; z+=10) {
          // Perspective projection for z
          // screenY = horizon + h / z * scale
          // Simplified: geometric progression
      }
      
      // Just plain linear with perspective math
      for(let i=0; i<height/2; i++) {
          // Inverse of index
          const y = height/2 + i;
          // Z depth from 1 to infinity approx
          const z = 1000 / (i + 1);
          
          // Moving grid check
          if ( (z + time) % 100 < 5 ) {
             ctx.moveTo(0, y);
             ctx.lineTo(width, y);
          }
      }
      
      // Vertical lines
      for(let x=-width; x<width*2; x+=100) {
          ctx.moveTo(x, height);
          ctx.lineTo(focalX, focalY);
      }
      
      ctx.stroke();

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
