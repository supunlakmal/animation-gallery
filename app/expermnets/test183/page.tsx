"use client";

import { useEffect, useRef } from "react";

export default function ColorPalettes() {
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
    
    const stripes = 5;
    
    const draw = () => {
        const w = canvas.width / stripes;
        
        for (let i = 0; i < stripes; i++) {
            // Smooth color transition
            const r = Math.sin(time + i) * 127 + 128;
            const g = Math.sin(time + i + 2) * 127 + 128;
            const b = Math.sin(time + i + 4) * 127 + 128;
            
            ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
            ctx.fillRect(i * w, 0, w + 1, canvas.height);
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

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-white" />;
}
