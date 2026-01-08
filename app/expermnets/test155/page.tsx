"use client";

import { useEffect, useRef } from "react";

export default function Kaleidoscope() {
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

    const slices = 12;
    const sliceAngle = (Math.PI * 2) / slices;

    const drawSlice = () => {
        // Just some random moving shapes
        const r1 = Math.sin(time) * 100 + 150;
        const r2 = Math.cos(time * 0.5) * 100 + 150;
        
        ctx.fillStyle = `hsl(${time * 50}, 70%, 50%)`;
        ctx.beginPath();
        ctx.arc(r1, 0, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsl(${time * 50 + 180}, 70%, 50%)`;
        ctx.beginPath();
        ctx.rect(r2, -20, 40, 40);
        ctx.fill();
        
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(300, 100 * Math.sin(time * 2));
        ctx.stroke();
    };

    const draw = () => {
        // Clear full
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // No trails for crisp kaleidoscope

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        for (let i = 0; i < slices; i++) {
            ctx.save();
            ctx.rotate(i * sliceAngle);
            
            // Draw one slice
            drawSlice();
            
            // Draw mirrored slice
            ctx.scale(1, -1);
            drawSlice();
            
            ctx.restore();
        }

        ctx.restore();

        time += 0.02;
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
