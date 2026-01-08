"use client";

import { useEffect, useRef } from "react";

export default function SpiralGalaxy() {
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
        radius: number;
        angle: number;
        distance: number;
        speed: number;
        color: string;
    }

    const stars: Star[] = [];
    const numStars = 2000;

    for(let i=0; i<numStars; i++) {
        const dist = Math.random() * (Math.min(canvas.width, canvas.height) / 2);
        stars.push({
            x: 0, 
            y: 0,
            radius: Math.random() * 1.5,
            angle: Math.random() * Math.PI * 2,
            distance: dist,
            speed: 0.002 + (1 / (dist + 10)) * 5, // Faster near center
            color: `hsla(${Math.random() * 60 + 200}, 80%, 70%, ${Math.random()})`
        });
    }

    const draw = () => {
        // Clear with trail effect
        ctx.fillStyle = "rgba(10, 10, 20, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.angle += star.speed;
            star.x = canvas.width / 2 + Math.cos(star.angle) * star.distance;
            star.y = canvas.height / 2 + Math.sin(star.angle) * star.distance;

            // Spiral distortion
            // Twist the angle based on distance for spiral arm effect?
            // Already doing orbital mechanics style, let's keep it simple.

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.fill();
        });

        // Glowing center
        const gradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2, 0,
            canvas.width/2, canvas.height/2, 50
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(0.5, "rgba(100, 200, 255, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-[#050510]" />;
}
