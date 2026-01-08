"use client";
import React, { useEffect, useRef } from "react";

export default function RetroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    let offset = 0;

    const animate = () => {
      // Sky
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#0b0014"); // Dark purple
      gradient.addColorStop(0.5, "#2d0042"); 
      gradient.addColorStop(0.5, "#000"); // Horizon line hard cut (ground start)
      gradient.addColorStop(1, "#1a0b2e"); 

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Sun
      const sunY = height * 0.4;
      const sunGradient = ctx.createLinearGradient(0, sunY - 100, 0, sunY + 100);
      sunGradient.addColorStop(0, "#fbcc2e");
      sunGradient.addColorStop(1, "#d62e7d");
      
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(width / 2, sunY, 150, 0, Math.PI * 2);
      ctx.fill();

      // Sun cuts
      ctx.fillStyle = "#0b0014"; // Sky color
      for (let i = 0; i < 10; i++) {
        const h = i * 4 + 2;
        const y = sunY + 50 + i * 15;
        if (y < sunY + 150) {
           ctx.fillRect(width/2 - 160, y, 320, h);
        }
      }

      // Grid (Perspective)
      ctx.strokeStyle = "#ff00e6"; // Neon pink
      ctx.lineWidth = 1;

      // Vertical lines
      const horizonY = height * 0.5;
      const centerX = width / 2;
      
      // Ground Only
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizonY, width, height - horizonY);
      ctx.clip(); // Only draw grid on ground

      // Moving Horizontal Lines
      offset = (offset + 1) % 50;
      for (let i = 0; i < height; i+=2) {
        // Logarithmic spacing for perspective 
        // Simple linear approach for retro look:
        // Proper perspective horizontal lines
      }
      
      // Moving Grid simple approach
      // Vertical fan
      for (let i = -20; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, horizonY);
        ctx.lineTo(centerX + (i * width * 1.5), height);
        ctx.stroke();
      }

      // Horizontal moving
      for (let i = 0; i < 20; i++) {
        const perspectiveY = horizonY + Math.pow(2, i * 0.5) + offset - 50;
        if (perspectiveY > horizonY && perspectiveY < height) {
           ctx.beginPath();
           ctx.moveTo(0, perspectiveY);
           ctx.lineTo(width, perspectiveY);
           ctx.stroke();
        }
      }
      
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-black"
    />
  );
}
