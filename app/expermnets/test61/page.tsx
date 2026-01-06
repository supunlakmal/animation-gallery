"use client";
import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number; // Previous Z
}

export default function StarfieldWarp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();

  const config = {
    starCount: 800,
    speed: 5,
    baseDepth: 1000, // Z depth
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
    };
    resize();

    // Initialize stars
    starsRef.current = Array.from({ length: config.starCount }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * config.baseDepth,
      pz: Math.random() * config.baseDepth,
    }));

    const animate = () => {
      // Create trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Black with fade
      ctx.fillRect(0, 0, width, height);

      starsRef.current.forEach((star) => {
        // Update Z
        star.z -= config.speed;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
          star.z = config.baseDepth;
          star.pz = config.baseDepth;
        }

        // Project 3D to 2D
        const k = 128.0 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        // Project previous position
        const pk = 128.0 / (star.z + config.speed * 2); // cheat a bit for trail
        const ppx = star.x * pk + cx;
        const ppy = star.y * pk + cy;

        // Draw line (streak)
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = (1 - star.z / config.baseDepth) * 3;
          const shade = Math.floor((1 - star.z / config.baseDepth) * 255);
          
          ctx.strokeStyle = `rgb(${shade}, ${shade}, 255)`;
          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);

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
