"use client";

import { useEffect, useRef } from "react";

export default function DigitalClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number | null = null;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const drawSegment = (x:number, y:number, w:number, h:number, on: boolean) => {
        ctx.fillStyle = on ? "#f00" : "#300";
        ctx.shadowBlur = on ? 20 : 0;
        ctx.shadowColor = "#f00";
        
        ctx.beginPath();
        // Hexagonal segment shape for retro look
        const bevel = Math.min(w, h) * 0.2;
        
        if (w > h) { // Horizontal
             ctx.moveTo(x + bevel, y);
             ctx.lineTo(x + w - bevel, y);
             ctx.lineTo(x + w, y + h/2);
             ctx.lineTo(x + w - bevel, y + h);
             ctx.lineTo(x + bevel, y + h);
             ctx.lineTo(x, y + h/2);
        } else { // Vertical
             ctx.moveTo(x, y + bevel);
             ctx.lineTo(x + w/2, y);
             ctx.lineTo(x + w, y + bevel);
             ctx.lineTo(x + w, y + h - bevel);
             ctx.lineTo(x + w/2, y + h);
             ctx.lineTo(x, y + h - bevel);
        }
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    const segments = [
        [1,1,1,0,1,1,1], // 0
        [0,0,1,0,0,1,0], // 1
        [1,0,1,1,1,0,1], // 2
        [1,0,1,1,0,1,1], // 3
        [0,1,1,1,0,1,0], // 4
        [1,1,0,1,0,1,1], // 5
        [1,1,0,1,1,1,1], // 6
        [1,0,1,0,0,1,0], // 7
        [1,1,1,1,1,1,1], // 8
        [1,1,1,1,0,1,1], // 9
    ];

    const drawDigit = (num: number, x: number, y: number, size: number) => {
        const w = size * 0.6;
        const h = size;
        const t = size * 0.1; // thickness
        
        const map = segments[num];
        
        // Positions relative to x,y
        // 0: top
        drawSegment(x + t, y, w - 2*t, t, !!map[0]);
        // 1: top-left
        drawSegment(x, y + t, t, h/2 - 2*t, !!map[1]);
        // 2: top-right
        drawSegment(x + w - t, y + t, t, h/2 - 2*t, !!map[2]);
        // 3: middle
        drawSegment(x + t, y + h/2 - t/2, w - 2*t, t, !!map[3]);
        // 4: bottom-left
        drawSegment(x, y + h/2 + t/2, t, h/2 - 2*t, !!map[4]);
        // 5: bottom-right
        drawSegment(x + w - t, y + h/2 + t/2, t, h/2 - 2*t, !!map[5]);
        // 6: bottom
        drawSegment(x + t, y + h - t, w - 2*t, t, !!map[6]);
    };

    const draw = () => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();

        const timeStr = [Math.floor(h/10), h%10, Math.floor(m/10), m%10, Math.floor(s/10), s%10];
        
        const size = 100;
        const startX = (canvas.width - (6 * size * 0.8 + 2 * size * 0.5)) / 2;
        const cy = (canvas.height - size) / 2;

        timeStr.forEach((digit, i) => {
            drawDigit(digit, startX + i * size * 0.8 + (Math.floor(i/2) * size * 0.3), cy, size);
            
            // Draw Dots
            if (i === 1 || i === 3) {
                 ctx.fillStyle = (s % 2 === 0) ? "#f00" : "#300";
                 ctx.shadowBlur = (s % 2 === 0) ? 20 : 0;
                 ctx.shadowColor = "#f00";
                 
                 ctx.fillRect(startX + (i+1) * size * 0.8 + (Math.floor(i/2) * size * 0.3) - size*0.15, cy + size*0.3, size*0.1, size*0.1);
                 ctx.fillRect(startX + (i+1) * size * 0.8 + (Math.floor(i/2) * size * 0.3) - size*0.15, cy + size*0.6, size*0.1, size*0.1);
                 
                 ctx.shadowBlur = 0;
            }
        });

        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-black" />;
}
