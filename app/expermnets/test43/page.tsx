"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export default function BlobAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const noise2D = createNoise2D(Math.random);

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let time = 0;

    const drawBlob = (cx: number, cy: number, radius: number, color: string, tOffset: number) => {
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
            const xoff = Math.cos(angle) * 1.5 + tOffset;
            const yoff = Math.sin(angle) * 1.5 + time;
            const r = radius + noise2D(xoff, yoff) * 50;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    let animId: number;
    const animate = () => {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, w, h);
        
        time += 0.005;

        // Composite mode for blending
        ctx.globalCompositeOperation = "multiply";
        
        drawBlob(w/2 - 50, h/2 - 50, 200, "#00cccc", 0);
        drawBlob(w/2 + 50, h/2 + 50, 180, "#cc00cc", 100);
        drawBlob(w/2, h/2, 150, "#cccc00", 200);
        
        ctx.globalCompositeOperation = "source-over";
        
        animId = requestAnimationFrame(animate);
    }

    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    animate();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animId);
    }
  }, []);

  return (
    <div className="w-full h-screen bg-[#f0f0f0]">
       <canvas ref={canvasRef} />
    </div>
  );
}
