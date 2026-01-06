"use client";

import { useEffect, useRef } from "react";

export default function BouncingLogo() {
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

    let x = 100;
    let y = 100;
    let vx = 3;
    let vy = 3;
    let color = "#f00";
    const width = 100;
    const height = 50;

    const randomColor = () => `hsl(${Math.random() * 360}, 100%, 50%)`;

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Standard clear

        x += vx;
        y += vy;

        // Collision
        if (x + width > canvas.width || x < 0) {
            vx *= -1;
            color = randomColor();
        }
        if (y + height > canvas.height || y < 0) {
            vy *= -1;
            color = randomColor();
        }

        ctx.fillStyle = color;
        ctx.font = "bold 40px sans-serif";
        ctx.textBaseline = "top";
        ctx.fillText("DVD", x + 10, y + 5); 
        
        // Ellipse
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2 + 5, width/2, height/4, 0, 0, Math.PI*2);
        ctx.stroke();

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
