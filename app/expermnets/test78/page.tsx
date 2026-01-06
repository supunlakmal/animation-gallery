"use client";
import React, { useEffect, useRef } from "react";

export default function GalaxySpiral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

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

    // Particles w/ Angle and Radius
    const particles = Array.from({ length: 2000 }, () => {
      const armIndex = Math.floor(Math.random() * 3); // 3 arms
      const randomOffset = Math.random() * 0.5 - 0.25;
      return {
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 400 + 50, // Distance from center
        speed: 0.002 + Math.random() * 0.005,
        armOffset: (Math.PI * 2 / 3) * armIndex + randomOffset,
        size: Math.random() * 2,
        color: armIndex === 0 ? "#FF55AA" : armIndex === 1 ? "#55AAFF" : "#AAFF55" // Different arm colors
      };
    });

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Trails
      ctx.fillRect(0, 0, width, height);
      
      ctx.save();
      ctx.translate(width / 2, height / 2);

      particles.forEach(p => {
        // Update angle (inner stars move faster in reality, let's just rotate constant for visual)
        p.angle += 0.01 * (200 / p.radius); // Kepler-ish
        
        // Calculate XY
        const spiralAngle = p.angle + p.radius * 0.01; // Twist
        const x = Math.cos(spiralAngle + p.armOffset) * p.radius;
        const y = Math.sin(spiralAngle + p.armOffset) * p.radius;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

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
