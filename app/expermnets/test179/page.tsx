"use client";

import { useEffect, useRef } from "react";

export default function Spirograph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = "#fff"; // Paper
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const R = 150;
    const r = 52;
    const O = 80;

    const draw = () => {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        for (let i = 0; i < 20; i++) { // Speed up drawing
            t += 0.05;
            
            const x = (R - r) * Math.cos(t) + O * Math.cos(((R - r) / r) * t);
            const y = (R - r) * Math.sin(t) - O * Math.sin(((R - r) / r) * t);

            ctx.fillStyle = `hsl(${t * 2 % 360}, 70%, 50%)`;
            ctx.fillRect(cx + x, cy + y, 2, 2);
        }

        // Fade slowly?
        // ctx.fillStyle = "rgba(255, 255, 255, 0.001)";
        // ctx.fillRect(0,0, canvas.width, canvas.height);

        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-white" />;
}
