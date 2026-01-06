"use client";

import { useEffect, useRef } from "react";

export default function Bubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    interface Bubble {
        x: number;
        y: number;
        r: number;
        speed: number;
        oscillation: number;
    }

    const bubbles: Bubble[] = [];
    for(let i=0; i<50; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 20 + 5,
            speed: Math.random() * 1 + 0.5,
            oscillation: Math.random() * Math.PI * 2
        });
    }

    const draw = () => {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "#4facfe");
        grad.addColorStop(1, "#00f2fe");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        bubbles.forEach(b => {
             b.y -= b.speed;
             b.oscillation += 0.05;
             b.x += Math.sin(b.oscillation) * 0.5;

             if (b.y < -50) {
                 b.y = canvas.height + 50;
                 b.x = Math.random() * canvas.width;
             }
             
             // Draw Bubble
             ctx.beginPath();
             ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
             ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
             ctx.fill();
             ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
             ctx.lineWidth = 1;
             ctx.stroke();
             
             // Shine
             ctx.beginPath();
             ctx.arc(b.x - b.r*0.3, b.y - b.r*0.3, b.r*0.2, 0, Math.PI * 2);
             ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
             ctx.fill();
        });

        animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full bg-blue-300" />;
}
