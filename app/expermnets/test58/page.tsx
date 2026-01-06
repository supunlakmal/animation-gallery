"use client";
import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export default function Aurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const noise2D = createNoise2D(Math.random);
    
    let time = 0;

    const animate = () => {
      ctx.fillStyle = "#00000a"; // Midnight blue/black
      ctx.fillRect(0, 0, width, height);
      
      // Draw stars
      for(let i=0; i<50; i++) {
           const x = (Math.sin(i * 123 + time * 0.01) * width + width) % width;
           const y = (Math.cos(i * 454) * height + height) % height;
           ctx.fillStyle = `rgba(255,255,255, ${Math.random()})`;
           ctx.fillRect(x,y, 2, 2);
      }

      // Draw Aurora
      // We draw multiple lines/bands
      const bands = 4;
      
      ctx.globalCompositeOperation = "screen"; // Additive blending for glow
      
      for(let b=0; b<bands; b++) {
          ctx.beginPath();
          const baseY = height * 0.4 + b * 50;
          
          for(let x=0; x<=width; x+=10) {
              const noiseVal = noise2D(x * 0.002, time * 0.5 + b) * 100;
              const y = baseY + noiseVal;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          }
          
          // Close the shape downwards to fill
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          
          // Gradient
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, `hsla(${120 + b * 20}, 80%, 60%, 0)`); // Top transparent
          gradient.addColorStop(0.5, `hsla(${120 + b * 20}, 80%, 60%, 0.3)`); // Middle color
          gradient.addColorStop(1, `hsla(${160 + b * 30}, 80%, 40%, 0)`); // Bottom transparent
          
          ctx.fillStyle = gradient;
          ctx.fill();
      }
      
      ctx.globalCompositeOperation = "source-over";

      time += 0.005;
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 bg-[#00000a]" />;
}
