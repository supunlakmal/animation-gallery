"use client";

import { useEffect, useRef } from "react";

export default function AudioVisualizer() {
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
    };
    window.addEventListener("resize", resize);
    resize();

    const barCount = 64;
    
    const draw = () => {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / barCount;
        const centerY = canvas.height / 2;

        for (let i = 0; i < barCount; i++) {
            // Simulate frequency data with sine waves
            const noise = Math.sin(i * 0.2 + time) + Math.sin(i * 0.5 - time * 2) * 0.5 + Math.sin(i * 0.1 + time * 0.5) * 0.2;
            const height = Math.abs(noise) * (canvas.height * 0.4) + 10;

            const hue = (i / barCount) * 360 + time * 20;
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;

            const x = i * barWidth;
            // Draw mirrored
            ctx.fillRect(x, centerY - height/2, barWidth - 2, height);
            
            // Relection
            ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.2)`;
            ctx.fillRect(x, centerY + height/2 + 2, barWidth - 2, height * 0.5);
        }

        time += 0.05;
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
