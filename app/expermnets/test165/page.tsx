"use client";

import { useEffect, useRef } from "react";

export default function LightTunnel() {
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

        const count = 20;
        const maxDist = 1000;

        for (let i = 0; i < count; i++) {
            // Z goes from 0 to maxDist
            // We want movement
            let z = (i * 100 - time * 200) % maxDist;
            if (z < 0) z += maxDist;
            
            // Perspective
            if (z < 10) continue;
            const scale = 500 / z;
            
            const w = canvas.width * scale * 0.5;
            const h = canvas.height * scale * 0.5;

            // Fade in distance
            const alpha = 1 - z / maxDist;
            
            ctx.strokeStyle = `hsla(${z * 0.5}, 100%, 50%, ${alpha})`;
            ctx.lineWidth = 5 * scale;
            
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(time * 0.1 + z * 0.001);
            ctx.strokeRect(-w/2, -h/2, w, h);
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
