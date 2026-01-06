"use client";

import { useEffect, useRef } from "react";

export default function GeometricTiling() {
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
    
    const tileSize = 50;

    const draw = () => {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#000";

        const cols = Math.ceil(canvas.width / tileSize);
        const rows = Math.ceil(canvas.height / tileSize);

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                // Determine rotation/type based on noise function or sin
                const val = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time);
                const type = val > 0 ? 1 : 0;
                
                const px = x * tileSize;
                const py = y * tileSize;

                ctx.save();
                ctx.translate(px + tileSize/2, py + tileSize/2);
                if (type) ctx.rotate(Math.PI / 2);
                ctx.translate(-tileSize/2, -tileSize/2);
                
                // Draw Truchet arcs
                ctx.beginPath();
                ctx.arc(0, 0, tileSize/2, 0, Math.PI / 2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(tileSize, tileSize, tileSize/2, Math.PI, Math.PI * 1.5);
                ctx.stroke();
                
                ctx.restore();
            }
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

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-white" />;
}
