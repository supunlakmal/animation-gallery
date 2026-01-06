"use client";
import React, { useEffect, useRef } from "react";

export default function PixelatedVoronoi() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Low resolution for the effect
    const simWidth = 80;
    const simHeight = 45;
    
    // Display size
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const points: { x: number; y: number; vx: number; vy: number; color: string }[] = [];
    const numPoints = 15;

    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * simWidth,
            y: Math.random() * simHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            color: `hsl(${Math.random() * 360}, 80%, 60%)`
        });
    }

    const animate = () => {
        // Update points
        points.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > simWidth) p.vx *= -1;
            if (p.y < 0 || p.y > simHeight) p.vy *= -1;
        });

        // Draw Voronoi
        // Create offscreen buffer or just draw large rects?
        // Iterating pixels is fine for 80x45 = 3600 pixels.
        
        ctx.clearRect(0, 0, width, height);
        
        const scaleX = width / simWidth;
        const scaleY = height / simHeight;

        for (let y = 0; y < simHeight; y++) {
            for (let x = 0; x < simWidth; x++) {
                let minDist = Infinity;
                let closestColor = "#000";

                for (const p of points) {
                    const d = (x - p.x) ** 2 + (y - p.y) ** 2;
                    if (d < minDist) {
                        minDist = d;
                        closestColor = p.color;
                    }
                }

                ctx.fillStyle = closestColor;
                ctx.fillRect(x * scaleX, y * scaleY, scaleX + 1, scaleY + 1);
            }
        }
        
        // Draw points
        points.forEach(p => {
             ctx.fillStyle = "white";
             ctx.beginPath();
             ctx.arc(p.x * scaleX, p.y * scaleY, 4, 0, Math.PI * 2);
             ctx.fill();
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
    const frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />;
}
