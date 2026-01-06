"use client";

import { useEffect, useRef } from "react";

export default function RainPuddles() {
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

    interface Ripple {
        x: number;
        y: number;
        radius: number;
        alpha: number;
        speed: number;
    }

    const ripples: Ripple[] = [];

    const draw = () => {
        // Dark rainy mood
        ctx.fillStyle = "rgba(10, 15, 30, 0.3)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Random rain
        if (Math.random() < 0.2) {
            ripples.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 1,
                alpha: 1,
                speed: Math.random() * 0.5 + 0.5
            });
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            // Ellipse for perspective
            // ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.5, 0, 0, Math.PI * 2);
            
            ctx.strokeStyle = `rgba(200, 220, 255, ${r.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            r.radius += r.speed;
            r.alpha -= 0.01;

            if (r.alpha <= 0) {
                ripples.splice(i, 1);
            }
        }

        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-[#050a14]" />;
}
