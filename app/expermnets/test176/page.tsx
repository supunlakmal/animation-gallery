"use client";

import { useEffect, useRef } from "react";

export default function Oscilloscope() {
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

    const draw = () => {
        // Fade
        ctx.fillStyle = "rgba(0, 20, 0, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#0F0";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round"; // Fix TS error? No, lineJoin is string.
        ctx.shadowBlur = 5;
        ctx.shadowColor = "#0F0";

        ctx.beginPath();
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const scale = 300;

        for (let i = 0; i < 500; i++) {
            const t = time + i * 0.01;
            
            // Parametric equations simulate "lissajous" style sound
            const x = Math.sin(t * 3) * Math.cos(t * 5 + time) * scale;
            const y = Math.sin(t * 4) * Math.sin(t * 2) * scale;
            
            if(i===0) ctx.moveTo(cx + x, cy + y);
            else ctx.lineTo(cx + x, cy + y);
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;

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
