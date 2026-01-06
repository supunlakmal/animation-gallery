"use client";
import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  color: string;
}

export default function NeonGalaxy() {
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

    const stars: Star[] = [];
    const numStars = 2000;
    const centerX = width / 2;
    const centerY = height / 2;
    const focalLength = canvas.width;

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - centerX,
        y: Math.random() * height - centerY,
        z: Math.random() * width,
        color: `hsl(${Math.random() * 360}, 100%, 70%)`
      });
    }

    const animate = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.z -= 2; // Move star closer

        if (star.z <= 0) {
          star.x = Math.random() * width - centerX;
          star.y = Math.random() * height - centerY;
          star.z = width;
          star.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        }

        const x = (star.x * focalLength) / star.z + centerX;
        const y = (star.y * focalLength) / star.z + centerY;
        const radius = Math.max(0.1, (1 - star.z / width) * 3);

        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        if (radius > 1.5) {
             ctx.shadowBlur = 10;
             ctx.shadowColor = star.color;
        } else {
             ctx.shadowBlur = 0;
        }
      });
      
      ctx.shadowBlur = 0; // Reset
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    const frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black" />;
}
