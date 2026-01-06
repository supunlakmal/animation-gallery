"use client";

import { useEffect, useRef } from "react";

export default function VaporwaveSun() {
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
        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, "#100020");
        bgGrad.addColorStop(1, "#400060");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height * 0.6;
        const sunRadius = 200;

        // Draw Sun
        const sunGrad = ctx.createLinearGradient(0, cy - sunRadius, 0, cy + sunRadius);
        sunGrad.addColorStop(0, "#FFFF00");
        sunGrad.addColorStop(1, "#FF0080");
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.fill();

        // Sun Stripes (Clip mask effect)
        ctx.fillStyle = "#200030"; // Dark color to "cut" the sun
        for (let i = 0; i < 20; i++) {
            const y = cy + i * 15 - 50; 
            const h = i * 2 + 2; // increasing height
            if (y > cy - sunRadius + 50) {
                 ctx.fillRect(cx - sunRadius, y, sunRadius * 2, h);
            }
        }
        ctx.restore();

        // 3D Grid
        ctx.save();
        ctx.strokeStyle = "rgba(255, 0, 255, 0.5)";
        ctx.lineWidth = 2;
        const horizon = cy + 50;
        
        // Vertical lines (perspective)
        for(let i=-20; i<=20; i++) {
             ctx.beginPath();
             // Focus point is cx, horizon
             // Actually, focus point is cx, horizon.
             // Line goes from (cx + off, canvas.height) to (cx + off*0.1, horizon)
             const xBottom = cx + i * 100 + (Math.sin(time * 0.5) * 50); // Just shift?
             // proper perspective
             const x1 = cx + i * 100;
             const x2 = cx + i * 10;
             
             ctx.moveTo(x1, canvas.height);
             ctx.lineTo(x2, horizon);
             ctx.stroke();
        }

        // Horizontal lines (moving down)
        const gridSpeed = (time * 100) % 100;
        for (let i=0; i<20; i++) {
            const yBase = horizon + Math.pow(i, 2) * 5; // Exponential spacing for depth
             // Moving logic:
             // Map i + offset
             
            // Simple approach: linear in 3D Z, projected to 2D Y
            // Z goes from 1 to 0 (screen)
        }
        
        // Simple horizontal bars moving down
        for (let z = 0; z < 1000; z+=50) {
             const zPos = (z - time * 200) % 1000;
             if (zPos < 0) continue;
             
             const y = horizon + (200 / (1050 - zPos)) * 500; // perspective projection ish
             
             // Wait, simpler:
             // Just plain horizontal lines
        }
        
        const lines = 16;
        for (let i = 0; i < lines; i++) {
            const p = (i + time * 0.5) % lines;
            const y = horizon + (p/lines) * (canvas.height - horizon);
            
            // Improve math for exponential floor
            // Normalized 0-1
            const t = (i/lines + time * 0.05) % 1;
            const yExp = horizon + (Math.pow(t, 4)) * (canvas.height - horizon);

             ctx.beginPath();
             ctx.moveTo(0, yExp);
             ctx.lineTo(canvas.width, yExp);
             ctx.stroke();
        }
        
        // Fill bottom to cover sun bottom
        // Actually sun is low enough
        
        ctx.restore();

        time += 0.01;
        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-[#100020]" />;
}
