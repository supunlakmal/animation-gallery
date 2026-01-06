"use client";

import { useEffect, useRef } from "react";

export default function HypnoticSpirals() {
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

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const maxRadius = Math.max(canvas.width, canvas.height);

        // Multiple spiral layers
        for (let i = 0; i < 3; i++) {
            ctx.save();
            ctx.translate(cx, cy);
            
            // Alternate rotation
            const dir = i % 2 === 0 ? 1 : -1;
            ctx.rotate(time * dir * (0.5 + i * 0.2));

            ctx.beginPath();
            const arms = 10;
            const step = 0.5;
            
            // Draw arms
            for(let a=0; a<arms; a++) {
                const angleOffset = (Math.PI * 2 / arms) * a;
                for (let r = 0; r < maxRadius; r += 5) {
                    const angle = r * 0.05 + angleOffset;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    
                    if (r===0) ctx.moveTo(x,y);
                    else ctx.lineTo(x, y);
                }
            }
            
            ctx.strokeStyle = `hsla(${time * 50 + i * 120}, 70%, 50%, 0.5)`;
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.restore();
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
