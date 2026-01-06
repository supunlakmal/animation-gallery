"use client";

import { useEffect, useRef } from "react";

export default function ParallaxStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
    
    interface Star {
        x: number;
        y: number;
        z: number; // Layer 1-3
        size: number;
    }
    
    const stars: Star[] = [];
    for(let i=0; i<300; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.floor(Math.random() * 3) + 1,
            size: Math.random() * 2 + 1
        });
    }

    const draw = () => {
        ctx.fillStyle = "#050510";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(s => {
            // Move based on Z layer
            s.x -= 0.5 * s.z;
            
            if (s.x < 0) {
                s.x = canvas.width;
                s.y = Math.random() * canvas.height;
            }
            
            const alpha = s.z / 3;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * (s.z * 0.5), 0, Math.PI * 2);
            ctx.fill();
        });

        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-black" />;
}
