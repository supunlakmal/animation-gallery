"use client";

import { useEffect, useRef } from "react";

export default function LiquidMetal() {
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
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#4af";
        ctx.lineWidth = 1;

        const spacing = 30;
        
        // Horizontal lines only for "Retro Wave" look? Or grid? 
        // Let's do horizontal lines that flow
        
        for (let y = 0; y < canvas.height; y += spacing) {
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += 10) {
                // Distortion
                const yOffset = 
                    Math.sin(x * 0.01 + time) * 20 + 
                    Math.sin(x * 0.02 + time * 2) * 10 +
                    Math.sin((x + y) * 0.01 + time) * 10;
                
                ctx.lineTo(x, y + yOffset);
            }
            // Opacity based on depth/height?
            ctx.stroke();
        }

         // Vertical lines
         for (let x = 0; x < canvas.width; x += spacing) {
            ctx.beginPath();
            for (let y = 0; y <= canvas.height; y += 10) {
                 const xOffset = 
                    Math.cos(y * 0.01 + time) * 20 +
                    Math.cos(y * 0.02 + time * 2) * 10;
                 // Manually plotting line points to match the Y distortion? 
                 // It gets complex to clear hidden lines (3D).
                 // Let's stick to just simpler wave mesh.
                 
                 // Reuse y logic for intersection? 
                 // Let's simplified version: Just simple vertical lines that wave
                 
                 ctx.lineTo(x + xOffset, y);
            }
            ctx.stroke();
         }


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
