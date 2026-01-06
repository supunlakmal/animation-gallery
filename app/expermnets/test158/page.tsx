"use client";

import { useEffect, useRef } from "react";

export default function Lissajous() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Init BG
    };
    window.addEventListener("resize", resize);
    resize();

    const particles = 10;

    const draw = () => {
        // Fade out
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const size = Math.min(canvas.width, canvas.height) * 0.4;

        for (let i = 0; i < particles; i++) {
            const offset = i * 0.5;
            
            // Lissajous params
            const a = 3 + Math.sin(time * 0.01);
            const b = 2 + Math.cos(time * 0.013);
            const delta = Math.PI / 2 + offset;

            const x = cx + size * Math.sin(a * time * 2 + delta);
            const y = cy + size * Math.sin(b * time * 2);

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${time * 50 + i * 30}, 100%, 50%)`;
            ctx.fill();
        }

        time += 0.01;
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
