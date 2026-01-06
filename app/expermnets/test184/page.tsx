"use client";

import { useEffect, useRef } from "react";

export default function Credits() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let scrollY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();
    
    const text = [
        "THANKS FOR WATCHING",
        "",
        "Directed by",
        "Supun Lakmal",
        "",
        "Produced by",
        "Agent Antigravity",
        "",
        "Visual Effects",
        "HTML5 Canvas",
        "",
        "Music",
        "Imagination",
        "",
        "~ FIN ~"
    ];

    const draw = () => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "30px sans-serif";
        ctx.textAlign = "center";
        
        const lineHeight = 50;
        const startY = canvas.height + 50;
        
        text.forEach((line, i) => {
            const y = startY + i * lineHeight - scrollY;
            
            if (y > -50 && y < canvas.height + 50) {
                ctx.fillStyle = "#fff";
                if (i === 0 || i === text.length - 1) {
                     ctx.font = "bold 40px serif";
                     ctx.fillStyle = "#ffd700";
                } else if (line === "") {
                    // spacer
                } else if (i % 2 === 0) {
                     ctx.font = "20px sans-serif";
                     ctx.fillStyle = "#888";
                } else {
                     ctx.font = "bold 30px sans-serif";
                }
                
                ctx.fillText(line, canvas.width / 2, y);
            }
        });

        scrollY += 1;
        if (scrollY > (text.length * lineHeight + canvas.height + 100)) {
            scrollY = 0;
        }

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
