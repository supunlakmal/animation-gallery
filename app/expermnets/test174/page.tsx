"use client";

import { useEffect, useRef } from "react";

export default function Snow() {
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

    interface Flake {
        x: number;
        y: number;
        r: number;
        s: number; // speed
        o: number; // offset for sway
    }
    
    const flakes: Flake[] = [];
    const count = 400;
    
    for(let i=0; i<count; i++) {
        flakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            s: Math.random() * 1 + 0.5,
            o: Math.random() * 100
        });
    }

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Standard clear
        
        // Gradient BG
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "#000010");
        grad.addColorStop(1, "#000030");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FFF";

        flakes.forEach(f => {
            f.y += f.s;
            f.x += Math.sin((time + f.o) * 0.05) * 0.5; // Wind sway
            
            if (f.y > canvas.height) {
                f.y = -5;
                f.x = Math.random() * canvas.width;
            }
            if (f.x > canvas.width) f.x = 0;
            if (f.x < 0) f.x = canvas.width;

            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fill();
        });

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
