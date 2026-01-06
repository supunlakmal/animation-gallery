"use client";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export default function OrganicBlobs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const noise3D = createNoise3D(Math.random);

    let time = 0;

    const drawBlob = (cx: number, cy: number, radius: number, color: string, speed: number, offset: number) => {
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
        // Use noise to displace the radius
        const xoff = Math.cos(angle) + offset;
        const yoff = Math.sin(angle) + offset;
        const noiseVal = noise3D(xoff, yoff, time * speed);
        const r = radius + noiseVal * 40;
        
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#fdfbfb");
      grad.addColorStop(1, "#ebedee");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      
      // Layering multiple blobs
      // We use 'multiply' or 'screen' blend modes for aesthetics
      ctx.globalCompositeOperation = "multiply"; // Watercolor effect
      
      // Blob 1
      drawBlob(width * 0.3, height * 0.4, 150, "rgba(255, 100, 100, 0.6)", 0.5, 0);
      
      // Blob 2
      drawBlob(width * 0.7, height * 0.6, 200, "rgba(100, 100, 255, 0.6)", 0.4, 10);
      
      // Blob 3
      drawBlob(width * 0.5, height * 0.5, 180, "rgba(100, 255, 150, 0.6)", 0.6, 20);

      ctx.globalCompositeOperation = "source-over"; // Reset

      time += 0.005;
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

  return <canvas ref={canvasRef} className="fixed inset-0 bg-white" />;
}
