"use client";

import { useEffect, useRef } from "react";

export default function AtomicOrbit() {
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
        // Trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Nucleus
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fillStyle = "#FF4444";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#FF0000";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Electrons
        const orbits = [
            { r: 80, s: 5, a: 0, color: "#4488FF" },
            { r: 80, s: 5, a: Math.PI / 2, color: "#4488FF" }, // Crossed orbit
            { r: 80, s: 5, a: Math.PI / 4, color: "#4488FF" },
            { r: 150, s: 3, a: 0.5, color: "#00FF88" }
        ];

        orbits.forEach((o, i) => {
            ctx.strokeStyle = `rgba(255,255,255,0.1)`;
            ctx.beginPath();
            ctx.ellipse(cx, cy, o.r, o.r * 0.3, o.a, 0, Math.PI * 2);
            ctx.stroke();

            // Electron pos
            const angle = time * o.s + i;
            // Elliptical coord
            const ex = Math.cos(angle) * o.r;
            const ey = Math.sin(angle) * (o.r * 0.3);
            
            // Rotate coord
            const rx = ex * Math.cos(o.a) - ey * Math.sin(o.a);
            const ry = ex * Math.sin(o.a) + ey * Math.cos(o.a);

            ctx.beginPath();
            ctx.arc(cx + rx, cy + ry, 8, 0, Math.PI * 2);
            ctx.fillStyle = o.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = o.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        time += 0.05;
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
