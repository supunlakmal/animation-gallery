"use client";

import { useEffect, useRef } from "react";

export default function CRTGlitch() {
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
    
    // Draw content to offscreen canvas or just draw text here
    
    const drawContent = (offsetX: number, offsetY: number, color: string) => {
        ctx.fillStyle = color;
        ctx.font = "bold 100px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("SYSTEM FAILURE", canvas.width/2 + offsetX, canvas.height/2 + offsetY);
        
        ctx.fillRect(canvas.width/2 - 100 + offsetX, canvas.height/2 + 60 + offsetY, 200, 20);
    };

    const draw = () => {
        ctx.fillStyle = "#111"; // Phosphor dark
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Glitch offsets
        const glitchX = Math.random() < 0.1 ? (Math.random() - 0.5) * 50 : 0;
        const glitchY = Math.random() < 0.1 ? (Math.random() - 0.5) * 5 : 0;

        // RGB Split
        ctx.globalCompositeOperation = 'screen';
        drawContent(glitchX - 5, glitchY, "#F00");
        drawContent(glitchX + 5, glitchY, "#0FF"); // Cyan for red/cyan split
        ctx.globalCompositeOperation = 'source-over';

        // Scanlines
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        for(let y=0; y<canvas.height; y+=4) {
             ctx.fillRect(0, y, canvas.width, 2);
        }
        
        // Rolling bar
        const rollY = (time * 5) % canvas.height;
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(0, rollY, canvas.width, 100);

        time += 1;
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
