"use client";

import { useEffect, useRef } from "react";

export default function DNAHelix() {
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
        ctx.fillStyle = "#051020";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const particles = 50;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const height = canvas.height * 0.8;
        const width = 100;
        
        for (let i = 0; i < particles; i++) {
            const y = (i / particles) * height - height/2 + cy;
            const yNorm = i / particles;
            
            // Helix 1
            const ang1 = yNorm * Math.PI * 4 + time;
            const x1 = Math.cos(ang1) * width + cx;
            const z1 = Math.sin(ang1); // Depth
            
            const r1 = 5 + z1 * 2;
            const alpha1 = 0.6 + z1 * 0.4;
            
            // Helix 2
            const ang2 = yNorm * Math.PI * 4 + time + Math.PI;
            const x2 = Math.cos(ang2) * width + cx;
            const z2 = Math.sin(ang2);
            
            const r2 = 5 + z2 * 2;
            const alpha2 = 0.6 + z2 * 0.4;
            
            // Draw Connector
            if (i % 3 === 0) {
                 ctx.strokeStyle = `rgba(255,255,255,0.1)`;
                 ctx.beginPath();
                 ctx.moveTo(x1, y);
                 ctx.lineTo(x2, y);
                 ctx.stroke();
            }

            // Draw Nodes
            ctx.fillStyle = `rgba(50, 150, 255, ${alpha1})`;
            ctx.beginPath();
            ctx.arc(x1, y, Math.max(0, r1), 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = `rgba(255, 50, 150, ${alpha2})`;
            ctx.beginPath();
            ctx.arc(x2, y, Math.max(0, r2), 0, Math.PI * 2);
            ctx.fill();
        }

        time += 0.03;
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
