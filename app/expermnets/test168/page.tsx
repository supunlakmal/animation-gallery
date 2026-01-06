"use client";

import { useEffect, useRef } from "react";

export default function Radar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
    
    interface Blip {
        x: number;
        y: number;
        life: number;
    }
    const blips: Blip[] = [];

    const draw = () => {
        ctx.fillStyle = "#001000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.4;

        // Grid
        ctx.strokeStyle = "#004000";
        ctx.lineWidth = 1;
        
        // Circles
        ctx.beginPath();
        for(let r=radius; r>0; r-=50) {
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
        }
        ctx.stroke();
        
        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - radius, cy);
        ctx.lineTo(cx + radius, cy);
        ctx.moveTo(cx, cy - radius);
        ctx.lineTo(cx, cy + radius);
        ctx.stroke();

        // Scan Line
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        
        // Gradient scan
        const grad = ctx.createLinearGradient(0, 0, radius, 0);
        grad.addColorStop(0, "rgba(0, 255, 0, 0)");
        grad.addColorStop(1, "rgba(0, 255, 0, 0.5)"); // Actually linear gradient on line? 
                                                        // Angular gradient is hard in vanilla 2d w/o loop.
                                                        // Just draw line + shape
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0,0, radius, 0, 0.1); // Small slice
        ctx.lineTo(0,0);
        ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(radius, 0);
        ctx.strokeStyle = "#0F0";
        ctx.stroke();
        
        ctx.restore();
        
        // Logic to add blips when scan passes?
        // Let's just spawn random blips and draw them
        if (Math.random() < 0.05) {
            const a = Math.random() * Math.PI * 2;
            const r = Math.random() * radius;
            blips.push({
                x: cx + Math.cos(a) * r,
                y: cy + Math.sin(a) * r,
                life: 1
            });
        }
        
        // Draw blips
        for (let i = blips.length - 1; i >= 0; i--) {
            const b = blips[i];
            ctx.fillStyle = `rgba(0, 255, 0, ${b.life})`;
            ctx.beginPath();
            ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
            ctx.fill();
            b.life -= 0.01;
            if (b.life <= 0) blips.splice(i, 1);
        }

        angle += 0.02;
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
